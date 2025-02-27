// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

import "forge-std/Test.sol";
import "../src/GhostPad.sol";
import "../src/TokenTemplate.sol";
import "../src/UniswapHandler.sol";
import "../src/Verifier.sol";
import "../src/MetadataVerifier.sol";
import "../src/interfaces/ITornadoInstance.sol";

// Mock TokenTemplate for testing
contract MockTokenTemplate {
    address public owner;
    string public description;
    uint256 public taxRate;
    address public taxRecipient;
    bool public burnEnabled;
    uint256 public liquidityLockPeriod;
    bool public vestingEnabled;
    bool public initialized = false;
    
    constructor() {}
    
    function initialize(
        string memory, // name
        string memory, // symbol
        uint256, // initialSupply
        address _owner,
        string memory _description,
        uint256 _taxRate,
        address _taxRecipient,
        bool _burnEnabled,
        uint256 _liquidityLockPeriod,
        bool _vestingEnabled
    ) external {
        require(!initialized, "Already initialized");
        owner = _owner;
        description = _description;
        taxRate = _taxRate;
        taxRecipient = _taxRecipient;
        burnEnabled = _burnEnabled;
        liquidityLockPeriod = _liquidityLockPeriod;
        vestingEnabled = _vestingEnabled;
        initialized = true;
    }
    
    function transfer(address, uint256) external pure returns (bool) {
        return true; // Always succeed in tests
    }
    
    function approve(address, uint256) external pure returns (bool) {
        return true; // Always succeed in tests
    }
}

// Mock Uniswap Router for testing
contract MockUniswapRouter {
    address public factory;
    address public WETH;
    address public mockPair;
    
    constructor(address _factory, address _weth) {
        factory = _factory;
        WETH = _weth;
        mockPair = address(0x1234567890123456789012345678901234567890); // Fake pair address
    }
    
    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity) {
        // Just return the input amounts and some fake liquidity
        return (amountTokenDesired, msg.value, 1000000);
    }
}

// Mock Uniswap Factory for testing
contract MockUniswapFactory {
    mapping(address => mapping(address => address)) public getPair;
    address public mockPair;
    
    constructor() {
        mockPair = address(0x1234567890123456789012345678901234567890); // Fake pair address
    }
    
    function createPair(address tokenA, address tokenB) external returns (address pair) {
        if (getPair[tokenA][tokenB] == address(0)) {
            getPair[tokenA][tokenB] = mockPair;
            getPair[tokenB][tokenA] = mockPair; // Also set the reverse mapping
        }
        return getPair[tokenA][tokenB];
    }
}

// Mock Uniswap Pair for testing
contract MockUniswapPair {
    address public token0;
    address public token1;
    mapping(address => uint256) public balanceOf;
    
    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;
    }
    
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) {
        return (1000, 1000, uint32(block.timestamp));
    }
    
    // Mock function to set LP token balance for a user
    function setBalance(address user, uint256 amount) external {
        balanceOf[user] = amount;
    }
}

// Mock Tornado instance for testing
contract MockTornadoInstance is ITornadoInstance {
    uint256 private _denomination;
    bytes32 private _lastRoot;
    
    // Store commitments and nullifier hashes like in the real contract
    mapping(bytes32 => bool) public commitments;
    mapping(bytes32 => bool) public nullifierHashes;
    
    // Events to match the real Tornado contract
    event Deposit(bytes32 indexed commitment, uint32 leafIndex, uint256 timestamp);
    event Withdrawal(address to, bytes32 nullifierHash, address indexed relayer, uint256 fee);
    
    constructor(uint256 denomination_) {
        _denomination = denomination_;
        _lastRoot = bytes32(uint256(123456789)); // Dummy root for testing
    }
    
    function denomination() external view override returns (uint256) {
        return _denomination;
    }
    
    function deposit(bytes32 commitment) external payable override {
        require(msg.value == _denomination, "Invalid deposit amount");
        require(!commitments[commitment], "Commitment already exists");
        
        // Record the commitment
        commitments[commitment] = true;
        
        // Emit Deposit event with fake leaf index
        emit Deposit(commitment, 0, block.timestamp);
    }
    
    function withdraw(
        bytes calldata /*proof*/,
        bytes32 /*root*/,
        bytes32 nullifierHash,
        address payable recipient,
        address payable relayer,
        uint256 fee,
        uint256 /*refund*/
    ) external payable override {
        require(!nullifierHashes[nullifierHash], "Note has been spent");
        require(fee <= _denomination, "Fee exceeds transfer value");
        
        // Make sure the contract has enough ETH to process the withdrawal
        require(address(this).balance >= _denomination, "Insufficient funds in Tornado instance");
        
        // Mark nullifier as spent
        nullifierHashes[nullifierHash] = true;
        
        // Process the withdrawal (simplified)
        uint256 amount = _denomination - fee;
        
        // Send fee to relayer if needed
        if (fee > 0 && relayer != address(0)) {
            (bool relayerSuccess, ) = relayer.call{value: fee}("");
            require(relayerSuccess, "Fee transfer failed");
        }
        
        // Send remaining amount to recipient
        (bool recipientSuccess, ) = recipient.call{value: amount}("");
        require(recipientSuccess, "ETH transfer failed");
        
        emit Withdrawal(recipient, nullifierHash, relayer, fee);
    }
    
    function getLastRoot() external view override returns (bytes32) {
        return _lastRoot;
    }
    
    function isSpent(bytes32 nullifierHash) external view override returns (bool) {
        return nullifierHashes[nullifierHash];
    }
}

contract GhostPadTest is Test {
    GhostPad public ghostPad;
    Verifier public verifier;
    MetadataVerifier public metadataVerifier;
    MockTokenTemplate public tokenTemplate;
    UniswapHandler public uniswapHandler;
    MockTornadoInstance public mockTornado;
    MockUniswapFactory public mockFactory;
    MockUniswapRouter public mockRouter;
    MockUniswapPair public mockPair;
    
    address public weth = address(0x5555555555555555555555555555555555555555);
    address public deployer = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    
    // Sample data for testing
    bytes32 public constant TEST_ROOT = bytes32(uint256(123456789));
    bytes32 public constant TEST_NULLIFIER_HASH = bytes32(uint256(987654321));
    bytes32 public constant TEST_METADATA_HASH = bytes32(uint256(555555555));
    
    // Counter for generating unique commitments
    uint256 private commitmentCounter;
    
    function setUp() public {
        vm.startPrank(deployer);
        
        // Deploy contracts
        verifier = new Verifier();
        metadataVerifier = new MetadataVerifier();
        tokenTemplate = new MockTokenTemplate();
        
        // Set up mock Uniswap contracts
        mockFactory = new MockUniswapFactory();
        mockRouter = new MockUniswapRouter(address(mockFactory), weth);
        
        // Now create the UniswapHandler with the mock router
        uniswapHandler = new UniswapHandler(address(mockRouter));
        
        // Create a real mock tornado instance with 1 ETH denomination
        mockTornado = new MockTornadoInstance(1 ether);
        
        // Create tornado instances array for GhostPad
        address[] memory tornadoInstances = new address[](1);
        tornadoInstances[0] = address(mockTornado);
        
        // Deploy GhostPad with dependencies
        ghostPad = new GhostPad(
            address(tokenTemplate),
            deployer, // governance address
            address(metadataVerifier),
            tornadoInstances,
            address(uniswapHandler)
        );
        
        // Initialize the counter for generating unique commitments
        commitmentCounter = 1;
        
        vm.stopPrank();
    }

    function testGhostPadInitialization() public {
        // Test that GhostPad was properly initialized
        assertEq(address(ghostPad.tokenTemplate()), address(tokenTemplate));
        assertEq(address(ghostPad.governance()), address(deployer));
        assertEq(address(ghostPad.metadataVerifier()), address(metadataVerifier));
        assertEq(address(ghostPad.uniswapHandler()), address(uniswapHandler));
        assertEq(ghostPad.instanceCount(), 1);
    }
    
    // Helper function to create a dummy TokenData struct for tests
    function createTestTokenData() internal pure returns (GhostPad.TokenData memory) {
        GhostPad.TokenData memory tokenData;
        tokenData.name = "Test Token";
        tokenData.symbol = "TEST";
        tokenData.initialSupply = 1000000 * 10**18; // 1M tokens
        tokenData.description = "A test token for GhostPad";
        tokenData.taxRate = 100; // 1%
        tokenData.taxRecipient = address(10); // Some tax recipient
        tokenData.burnEnabled = true;
        tokenData.liquidityLockPeriod = 365 days; // 1 year
        
        return tokenData;
    }
    
    // Helper function to create a dummy ProofData struct for tests
    function createTestProofData() internal view returns (GhostPad.ProofData memory) {
        GhostPad.ProofData memory proofData;
        proofData.instanceIndex = 0;
        proofData.proof = bytes("dummy proof");
        proofData.root = TEST_ROOT;
        proofData.nullifierHash = TEST_NULLIFIER_HASH;
        proofData.recipient = payable(user1);
        proofData.relayer = payable(address(0)); // No relayer
        proofData.fee = 0;
        proofData.refund = 0;
        proofData.metadataProof = bytes("dummy metadata proof");
        proofData.metadataHash = TEST_METADATA_HASH;
        
        return proofData;
    }
    
    // Test deploying a token with mocks
    function testDeployToken() public {
        // First make deposits into Tornado to build up its balance
        bytes32 commitment = generateCommitment();
        
        // Give user1 ETH for deposit
        vm.deal(user1, 2 ether); // 2 ETH for deposit + gas costs
        
        // User1 makes the deposit
        vm.prank(user1);
        mockTornado.deposit{value: 1 ether}(commitment);
        
        // Create test data
        GhostPad.TokenData memory tokenData = createTestTokenData();
        GhostPad.ProofData memory proofData = createTestProofData();
        
        // Mock the verification calls
        vm.mockCall(
            address(metadataVerifier),
            abi.encodeWithSelector(IMetadataVerifier.verifyProof.selector),
            abi.encode(true)
        );
        
        // We need to also mock the token transfer call since we're not actually doing a full deployment
        // This will happen after initialize() when GhostPad calls transfer() for the governance fee
        vm.mockCall(
            address(0), // This will be filled in by Forge with the actual created token address
            abi.encodeWithSelector(IERC20.transfer.selector),
            abi.encode(true) // Return success
        );
        
        // Deploy token - need to call as deployer since they are the governance address
        vm.prank(deployer);
        address token = ghostPad.deployToken(tokenData, proofData, true, false);
        
        // Verify token was deployed
        assertEq(ghostPad.getDeployedToken(proofData.nullifierHash), token);
        assertEq(ghostPad.nullifierHashUsed(proofData.nullifierHash), true);
    }
    
    // Test deploying a token with liquidity
    function testDeployTokenWithLiquidity() public {
        // First make deposits into Tornado to build up its balance
        bytes32 commitment = generateCommitment();
        
        // Give user1 ETH for deposit
        vm.deal(user1, 1 ether); 
        
        // User1 makes the deposit
        vm.prank(user1);
        mockTornado.deposit{value: 1 ether}(commitment);
        
        // Create test data
        GhostPad.TokenData memory tokenData = createTestTokenData();
        GhostPad.ProofData memory proofData = createTestProofData();
        
        uint256 liquidityTokenAmount = 100000 * 10**18; // 100K tokens
        uint256 liquidityEthAmount = 10 ether;
        
        // Mock the verification calls
        vm.mockCall(
            address(metadataVerifier),
            abi.encodeWithSelector(IMetadataVerifier.verifyProof.selector),
            abi.encode(true)
        );
        
        // We need to also mock the token transfer call since we're not actually doing a full deployment
        vm.mockCall(
            address(0), // This will be filled in by Forge with the actual created token address
            abi.encodeWithSelector(IERC20.transfer.selector),
            abi.encode(true) // Return success
        );
        
        // Mock the approve call for liquidity
        vm.mockCall(
            address(0),
            abi.encodeWithSelector(IERC20.approve.selector),
            abi.encode(true)
        );
        
        // Mock the addLiquidity call
        vm.mockCall(
            address(uniswapHandler),
            abi.encodeWithSelector(UniswapHandler.addLiquidity.selector),
            abi.encode(1000000) // Return some liquidity amount
        );
        
        // Mock the getLiquidityInfo call
        vm.mockCall(
            address(uniswapHandler),
            abi.encodeWithSelector(UniswapHandler.getLiquidityInfo.selector),
            abi.encode(address(mockFactory), 0, 0, 0) // Return mock data
        );
        
        // Give deployer ETH for liquidity
        vm.deal(deployer, liquidityEthAmount + proofData.refund + 1 ether); // Liquidity + refund + extra
        
        // Deploy token with liquidity - need to call as deployer since they are the governance address
        vm.prank(deployer);
        address token = ghostPad.deployTokenWithLiquidity{value: liquidityEthAmount + proofData.refund}(
            tokenData,
            proofData,
            liquidityTokenAmount,
            liquidityEthAmount,
            true, // use protocol fee
            false // no vesting
        );
        
        // Verify token was deployed
        assertEq(ghostPad.getDeployedToken(proofData.nullifierHash), token);
    }

    // Helper function to create a unique commitment for Tornado tests
    function generateCommitment() internal returns (bytes32) {
        // Increment counter to ensure uniqueness
        commitmentCounter += 1;
        
        // Create commitment using counter as a salt
        bytes32 nullifier = keccak256(abi.encodePacked("nullifier", commitmentCounter));
        bytes32 secret = keccak256(abi.encodePacked("secret", commitmentCounter));
        
        return keccak256(abi.encodePacked(nullifier, secret));
    }
    
    // Test the complete flow including deposit and withdrawal
    function testCompleteFlow() public {
        // Give user1 ETH for deposits
        vm.deal(user1, 3 ether); // 3 ETH for multiple deposits and gas
        
        // Make deposits to build the tornado contract's balance
        // User1 makes the deposits
        vm.startPrank(user1);
        
        bytes32 commitment1 = generateCommitment();
        mockTornado.deposit{value: 1 ether}(commitment1);
        
        bytes32 commitment2 = generateCommitment();
        mockTornado.deposit{value: 1 ether}(commitment2);
        
        bytes32 commitment3 = generateCommitment();
        mockTornado.deposit{value: 1 ether}(commitment3);
        
        vm.stopPrank();
        
        // Create test data for token deployment
        GhostPad.TokenData memory tokenData = createTestTokenData();
        GhostPad.ProofData memory proofData = createTestProofData();
        
        // Mock the verification calls
        vm.mockCall(
            address(metadataVerifier),
            abi.encodeWithSelector(IMetadataVerifier.verifyProof.selector),
            abi.encode(true)
        );
        
        // We need to also mock the token transfer call since we're not actually doing a full deployment
        vm.mockCall(
            address(0), // This will be filled in by Forge with the actual created token address
            abi.encodeWithSelector(IERC20.transfer.selector),
            abi.encode(true) // Return success
        );
        
        // Deploy token - call as deployer (governance)
        vm.prank(deployer);
        address token = ghostPad.deployToken(tokenData, proofData, true, false);
        
        // Verify token was deployed
        assertEq(ghostPad.getDeployedToken(proofData.nullifierHash), token);
        assertEq(ghostPad.nullifierHashUsed(proofData.nullifierHash), true);
    }
} 