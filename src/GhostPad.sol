// https://ghostpad.io
/*
 *   ______    __                      __     ____               __
 *  / ____/   / /_   ____    _____   / /_   / __ \  ____ _   __/ /
 * / / __    / __ \ / __ \  / ___/  / __/  / /_/ / / __ \ | / / / 
 * / /_/ /   / / / // /_/ / (__  )  / /_   / ____/ / /_/ / |/ / /  
 * \____/   /_/ /_/ \____/ /____/   \__/  /_/      \____/|___/_/   
 * 
 * Anonymous Memecoin Launching Platform
 */

// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./interfaces/ITornadoInstance.sol";
import "./TokenTemplate.sol";
import "./UniswapHandler.sol";

interface ITokenTemplate {
    function initialize(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address owner,
        string memory description,
        uint256 taxRate,
        address taxRecipient,
        bool burnEnabled,
        uint256 liquidityLockPeriod,
        bool vestingEnabled
    ) external;

    function calculateOwnerPercentage(uint256 ethAmount) external pure returns (uint256);
}

/**
 * @title GhostPad
 * @dev A platform for anonymous token deployment using Tornado Cash
 */
contract GhostPad is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    
    // Address of the token template for cloning
    address public tokenTemplate;
    
    // Address that receives fees and has special privileges
    address public governance;
    
    // Address of the Uniswap handler contract
    address public uniswapHandler;
    
    // Tornado Cash instance info
    struct TornadoInstanceInfo {
        address instance;
        uint256 denomination;
    }
    
    // Array of Tornado instances used by this contract
    TornadoInstanceInfo[] public tornadoInstances;
    
    // Map of nullifier hash => deployed token address
    mapping(bytes32 => address) public deployedTokens;
    
    // Map of nullifier hash => whether it has been used
    mapping(bytes32 => bool) public nullifierHashUsed;
    
    // Configurable protocol fee instead of constant
    uint32 public governanceFee = 300; // Default: 3% (in basis points)
    uint32 public constant MAX_GOVERNANCE_FEE = 500; // Maximum fee: 5%
    
    // Events
    event TokenDeployed(bytes32 indexed nullifierHash, address tokenAddress, string name, string symbol);
    event GovernanceUpdated(address indexed oldGovernance, address indexed newGovernance);
    event UniswapHandlerUpdated(address indexed oldHandler, address indexed newHandler);
    event LiquidityPoolCreated(address indexed tokenAddress, address indexed pairAddress, uint256 liquidityAdded);
    event GovernanceFeeUpdated(uint32 oldFee, uint32 newFee);
    
    /**
     * @dev Constructor
     * @param _tokenTemplate Address of the token template
     * @param _governance Address that will receive fees
     * @param _tornadoInstances Array of tornado instance addresses
     * @param _uniswapHandler Address of the Uniswap handler contract
     */
    constructor(
        address _tokenTemplate,
        address _governance,
        address[] memory _tornadoInstances,
        address _uniswapHandler
    ) {
        require(_tokenTemplate != address(0), "Invalid token template address");
        require(_governance != address(0), "Invalid governance address");
        require(_tornadoInstances.length > 0, "No tornado instances provided");
        require(_uniswapHandler != address(0), "Invalid Uniswap handler address");
        
        tokenTemplate = _tokenTemplate;
        governance = _governance;
        uniswapHandler = _uniswapHandler;
        
        // Add Tornado instances
        for (uint256 i = 0; i < _tornadoInstances.length; i++) {
            address instance = _tornadoInstances[i];
            require(instance != address(0), "Invalid tornado instance address");
            
            uint256 denomination = ITornadoInstance(instance).denomination();
            tornadoInstances.push(TornadoInstanceInfo({
                instance: instance,
                denomination: denomination
            }));
        }
    }
    
    /**
     * @dev Receive function to accept ETH transfers
     * This is needed for receiving ETH from Tornado instances and other operations
     */
    receive() external payable {
        // Simply accept ETH
    }
    
    /**
     * @dev Fallback function to accept ETH transfers
     * This provides backward compatibility for older contracts that don't use receive()
     */
    fallback() external payable {
        // Simply accept ETH
    }
    
    /**
     * @dev Deploy a new token using a tornado withdrawal proof
     * @param tokenData Struct containing token metadata and parameters
     * @param proofData Struct containing tornado proof data
     */
    function deployToken(
        TokenData memory tokenData,
        ProofData memory proofData
    ) external returns (address) {
        // Process the tornado proof
        _processTornadoProof(proofData);
        
        // Deploy and initialize the token
        uint256 fee = tokenData.useProtocolFee ? governanceFee : 0;
        address tokenAddress = _deployAndInitializeToken(tokenData, proofData, fee);
        
        // Update state
        deployedTokens[proofData.nullifierHash] = tokenAddress;
        nullifierHashUsed[proofData.nullifierHash] = true;
        
        emit TokenDeployed(proofData.nullifierHash, tokenAddress, tokenData.name, tokenData.symbol);
        
        return tokenAddress;
    }
    
    /**
     * @dev Process the tornado proof
     * @param proofData Struct containing tornado proof data
     */
    function _processTornadoProof(ProofData memory proofData) private {
        require(proofData.instanceIndex < tornadoInstances.length, "Instance index out of bounds");
        TornadoInstanceInfo memory instanceInfo = tornadoInstances[proofData.instanceIndex];
        ITornadoInstance tornadoInstance = ITornadoInstance(instanceInfo.instance);
        
        // Perform the Tornado withdrawal
        tornadoInstance.withdraw{value: proofData.refund}(
            proofData.proof,
            proofData.root,
            proofData.nullifierHash,
            proofData.recipient, // This should be the contract address for liquidity
            proofData.relayer,
            proofData.fee,
            proofData.refund
        );
    }
    
    /**
     * @dev Deploy and initialize a new token
     * @param tokenData Struct containing token metadata and parameters
     * @param proofData Struct containing tornado proof data
     * @param fee Protocol fee in basis points
     * @return tokenAddress Address of the deployed token
     */
    function _deployAndInitializeToken(
        TokenData memory tokenData,
        ProofData memory proofData,
        uint256 fee
    ) private returns (address tokenAddress) {
        // Deploy a new token using the clone factory
        tokenAddress = Clones.clone(tokenTemplate);
        TokenTemplate token = TokenTemplate(payable(tokenAddress));
        
        // Initialize the token
        token.initialize(
            tokenData.name,
            tokenData.symbol,
            tokenData.initialSupply,
            proofData.recipient,
            tokenData.description,
            tokenData.taxRate,
            tokenData.taxRecipient,
            tokenData.burnEnabled,
            tokenData.liquidityLockPeriod,
            tokenData.vestingEnabled
        );
        
        // Transfer fee if applicable
        if (fee > 0) {
            uint256 feeAmount = tokenData.initialSupply.mul(fee).div(10000);
            token.transfer(governance, feeAmount);
        }
        
        return tokenAddress;
    }
    
    /**
     * @dev Deploy a new token with Uniswap liquidity using a tornado withdrawal proof
     * @param tokenData Struct containing token metadata and parameters
     * @param proofData Struct containing tornado proof data
     */
    function deployTokenWithLiquidity(
        TokenData memory tokenData,
        ProofData memory proofData
    ) external payable returns (address tokenAddress) {
        require(proofData.instanceIndex < tornadoInstances.length, "Instance index out of bounds");
        require(tokenData.liquidityTokenAmount > 0, "Liquidity token amount must be greater than 0");
        
        // Make sure the recipient is this contract so it receives the ETH from Tornado
        proofData.recipient = payable(address(this));
        // Add an assertion to ensure recipient is correctly set
        require(proofData.recipient == payable(address(this)), "Recipient must be this contract");
        
        // Get the instance information to know the ETH amount
        TornadoInstanceInfo memory instanceInfo = tornadoInstances[proofData.instanceIndex];
        uint256 liquidityEthAmount = instanceInfo.denomination;
        
        // Make sure enough ETH was sent for the refund
        require(msg.value >= proofData.refund, "Insufficient ETH sent for refund");
        
        // Deploy the token first
        tokenAddress = this.deployToken(
            tokenData,
            proofData
        );
        
        // Add liquidity using the ETH received from Tornado
        _addLiquidity(tokenAddress, tokenData.liquidityTokenAmount, liquidityEthAmount);
        
        return tokenAddress;
    }
    
    /**
     * @dev Helper function to add liquidity to reduce stack depth
     */
    function _addLiquidity(
        address tokenAddress,
        uint256 liquidityTokenAmount, 
        uint256 liquidityEthAmount
    ) private returns (uint256 liquidity) {
        if (liquidityTokenAmount > 0 && liquidityEthAmount > 0) {
            // Approve tokens for the Uniswap handler
            IERC20(tokenAddress).approve(uniswapHandler, liquidityTokenAmount);
            
            // Create liquidity pool
            UniswapHandler uniswapHandlerContract = UniswapHandler(payable(uniswapHandler));
            liquidity = uniswapHandlerContract.addLiquidity{value: liquidityEthAmount}(
                tokenAddress,
                liquidityTokenAmount,
                liquidityEthAmount,
                0 // We'll get the lock period from the token
            );
            
            // Get the pair address
            (address pairAddress,,, ) = uniswapHandlerContract.getLiquidityInfo(tokenAddress);
            
            emit LiquidityPoolCreated(tokenAddress, pairAddress, liquidity);
        }
        
        return liquidity;
    }
    
    /**
     * @dev Get the number of tornado instances registered
     */
    function instanceCount() external view returns (uint256) {
        return tornadoInstances.length;
    }
    
    /**
     * @dev Get a tornado instance by index
     * @param index Index of the instance
     */
    function getTornadoInstance(uint256 index) external view returns (address instance, uint256 denomination) {
        require(index < tornadoInstances.length, "Invalid instance index");
        TornadoInstanceInfo memory info = tornadoInstances[index];
        return (info.instance, info.denomination);
    }
    
    /**
     * @dev Get the deployed token address for a given nullifier hash
     * @param nullifierHash The nullifier hash used for deployment
     */
    function getDeployedToken(bytes32 nullifierHash) external view returns (address) {
        return deployedTokens[nullifierHash];
    }
    
    /**
     * @dev Update the governance address (only callable by current governance)
     * @param _newGovernance New governance address
     */
    function updateGovernance(address _newGovernance) external {
        require(msg.sender == governance, "Only governance can update governance");
        require(_newGovernance != address(0), "Invalid governance address");
        
        address oldGovernance = governance;
        governance = _newGovernance;
        
        emit GovernanceUpdated(oldGovernance, _newGovernance);
    }
    
    /**
     * @dev Update the Uniswap handler address (only callable by owner)
     * @param _newHandler New Uniswap handler address
     */
    function updateUniswapHandler(address _newHandler) external onlyOwner {
        require(_newHandler != address(0), "Invalid Uniswap handler address");
        
        address oldHandler = uniswapHandler;
        uniswapHandler = _newHandler;
        
        emit UniswapHandlerUpdated(oldHandler, _newHandler);
    }
    
    /**
     * @dev Update the governance fee (only callable by governance)
     * @param _newFee New fee in basis points (1/100 of a percent)
     */
    function updateGovernanceFee(uint32 _newFee) external {
        require(msg.sender == governance, "Only governance can update fee");
        require(_newFee <= MAX_GOVERNANCE_FEE, "Fee exceeds maximum allowed");
        
        uint32 oldFee = governanceFee;
        governanceFee = _newFee;
        
        emit GovernanceFeeUpdated(oldFee, _newFee);
    }
    
    /**
     * @dev Recover ETH accidentally sent to this contract
     */
    function recoverETH() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Recover ERC20 tokens accidentally sent to this contract
     * @param token Address of the token
     * @param amount Amount to recover
     */
    function recoverERC20(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(msg.sender, amount);
    }
    
    // Define structs to pack parameters and reduce stack usage
    struct DeployParams {
        uint256 taxRate;
        address taxRecipient;
        bool burnEnabled;
        uint256 liquidityLockPeriod;
    }
    
    struct TokenData {
        string name;
        string symbol;
        uint256 initialSupply;
        string description;
        uint256 taxRate;
        address taxRecipient;
        bool burnEnabled;
        uint256 liquidityLockPeriod;
        uint256 liquidityTokenAmount;
        bool useProtocolFee;
        bool vestingEnabled;
    }
    
    struct ProofData {
        uint256 instanceIndex;
        bytes proof;
        bytes32 root;
        bytes32 nullifierHash;
        address payable recipient;
        address payable relayer;
        uint256 fee;
        uint256 refund;
    }
} 