// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUniswapHandler
 * @dev Mock implementation of UniswapHandler for testing
 */
contract MockUniswapHandler is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    
    address public immutable uniswapRouterAddress;
    address public immutable uniswapFactoryAddress;
    
    struct LiquidityInfo {
        address pair;
        bool isLocked;
        uint256 unlockTime;
    }
    
    mapping(address => LiquidityInfo) public liquidityInfo;
    mapping(address => bool) public mockLiquidityLocked;
    mapping(address => bool) public mockLPTokensTransferred;
    bool public mockAddLiquidityResult = false;
    
    event LiquidityAdded(
        address indexed token,
        address indexed pair,
        uint256 amountToken,
        uint256 amountETH,
        uint256 liquidity
    );
    
    event LiquidityLocked(
        address indexed token,
        address indexed pair,
        uint256 lockPeriod,
        uint256 unlockTime
    );
    
    /**
     * @dev Constructor
     * @param _uniswapRouterAddress Mock router address
     * @param _uniswapFactoryAddress Mock factory address
     */
    constructor(address _uniswapRouterAddress, address _uniswapFactoryAddress) {
        uniswapRouterAddress = _uniswapRouterAddress;
        uniswapFactoryAddress = _uniswapFactoryAddress;
    }
    
    /**
     * @dev Mock function to set the result of addLiquidity
     * @param result True for success, false for failure
     */
    function setMockAddLiquidityResult(bool result) external onlyOwner {
        mockAddLiquidityResult = result;
    }
    
    /**
     * @dev Mock function to set the liquidity lock status
     * @param tokenAddress The token address
     * @param isLocked Whether liquidity is locked
     */
    function setMockLiquidityLocked(address tokenAddress, bool isLocked) external onlyOwner {
        mockLiquidityLocked[tokenAddress] = isLocked;
        
        LiquidityInfo storage info = liquidityInfo[tokenAddress];
        info.isLocked = isLocked;
        info.unlockTime = isLocked ? block.timestamp + 100 : 0;
    }
    
    /**
     * @dev Check if liquidity is locked for a token (mock function)
     * @param tokenAddress The token address
     */
    function isMockLiquidityLocked(address tokenAddress) external view returns (bool) {
        return mockLiquidityLocked[tokenAddress];
    }
    
    /**
     * @dev Create a mock Uniswap pair for a token
     * @param tokenAddress The token address
     */
    function createPair(address tokenAddress) public returns (address) {
        // Create a mock pair address
        address mockPair = address(uint160(uint256(keccak256(abi.encodePacked(tokenAddress, block.timestamp)))));
        
        // Store the pair in the mapping
        liquidityInfo[tokenAddress].pair = mockPair;
        
        return mockPair;
    }
    
    /**
     * @dev Mock add liquidity function
     * @param tokenAddress The token address
     * @param tokenAmount Token amount
     * @param ethAmount ETH amount
     * @param lockPeriod Lock period in seconds
     */
    function addLiquidity(
        address tokenAddress,
        uint256 tokenAmount,
        uint256 ethAmount,
        uint256 lockPeriod
    ) external payable returns (uint256) {
        require(tokenAddress != address(0), "Token address cannot be zero");
        require(tokenAmount > 0, "Token amount must be greater than 0");
        require(msg.value == ethAmount, "Sent ETH must match ethAmount");
        
        // Get or create a mock pair
        address pairAddress = liquidityInfo[tokenAddress].pair;
        if (pairAddress == address(0)) {
            pairAddress = createPair(tokenAddress);
        }
        
        // Mock liquidity amount
        uint256 liquidity = tokenAmount.div(2);
        
        // Update liquidity info
        liquidityInfo[tokenAddress] = LiquidityInfo({
            pair: pairAddress,
            isLocked: lockPeriod > 0,
            unlockTime: lockPeriod > 0 ? block.timestamp.add(lockPeriod) : 0
        });
        
        // Set mock lock status
        mockLiquidityLocked[tokenAddress] = lockPeriod > 0;
        
        emit LiquidityAdded(tokenAddress, pairAddress, tokenAmount, ethAmount, liquidity);
        
        if (lockPeriod > 0) {
            emit LiquidityLocked(tokenAddress, pairAddress, lockPeriod, liquidityInfo[tokenAddress].unlockTime);
        }
        
        return liquidity;
    }
    
    /**
     * @dev Mock function to transfer LP tokens
     * @param tokenAddress The token address
     */
    function transferLPTokens(address tokenAddress) external onlyOwner {
        LiquidityInfo storage info = liquidityInfo[tokenAddress];
        require(info.pair != address(0), "Pair doesn't exist");
        require(!info.isLocked || block.timestamp >= info.unlockTime, "Liquidity is still locked");
        
        // Mark as transferred in mock
        mockLPTokensTransferred[tokenAddress] = true;
    }
    
    /**
     * @dev Get liquidity information for a token
     * @param tokenAddress The token address
     */
    function getLiquidityInfo(address tokenAddress) external view returns (
        address pair,
        bool isLocked,
        uint256 unlockTime,
        uint256 lpBalance
    ) {
        LiquidityInfo storage info = liquidityInfo[tokenAddress];
        pair = info.pair;
        isLocked = info.isLocked;
        unlockTime = info.unlockTime;
        
        // Mock LP balance
        lpBalance = info.pair != address(0) ? 1000 : 0;
    }
    
    /**
     * @dev Check if LP tokens have been transferred (mock)
     * @param tokenAddress The token address
     */
    function getMockLPTokensTransferred(address tokenAddress) external view returns (bool) {
        return mockLPTokensTransferred[tokenAddress];
    }
    
    /**
     * @dev Allow contract to receive ETH
     */
    receive() external payable {}
} 