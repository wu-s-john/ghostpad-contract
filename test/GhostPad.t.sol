// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

import "forge-std/Test.sol";
import "../src/GhostPad.sol";
import "../src/TokenTemplate.sol";
import "../src/UniswapHandler.sol";
import "../src/Verifier.sol";
import "../src/interfaces/ITornadoInstance.sol";
import "../src/Mocks/MockTornadoInstance.sol";
import "../src/Mocks/MockUniswapHandler.sol";
import "../src/Mocks/Hasher.sol";

contract GhostPadTest is Test {
    GhostPad public ghostPad;
    Verifier public verifier;
    TokenTemplate public tokenTemplate;
    MockUniswapHandler public mockUniswapHandler; // Use mock handler instead of real one
    MockTornadoInstance public mockTornadoInstance;
    Hasher public hasher;

    address public weth = address(0x5555555555555555555555555555555555555555);
    address public deployer = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    address public mockRouterAddress = address(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D); // Common Uniswap router address
    address public mockFactoryAddress = address(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f); // Common Uniswap factory address
    address public mockPairAddress = address(0x1234567890123456789012345678901234567890);
    
    // Test constants
    bytes32 public constant TEST_ROOT = bytes32(uint256(123456789));
    bytes32 public constant TEST_NULLIFIER_HASH = bytes32(0x203ce61f65255504e390b18f9d77181a0d441b35f224370e5838f405639791d4);
    
    // Counter for generating unique commitments
    uint256 private commitmentCounter;
    
    function setUp() public {
        vm.startPrank(deployer);
        
        // Deploy contracts
        verifier = new Verifier();
        tokenTemplate = new TokenTemplate();
        hasher = new Hasher();
        
        // Use MockUniswapHandler instead of the real one with mocked router and factory
        mockUniswapHandler = new MockUniswapHandler(mockRouterAddress, mockFactoryAddress);
        
        // Create a real mock tornado instance with 1 ETH denomination
        mockTornadoInstance = new MockTornadoInstance(1 ether);
        
        // Create tornado instances array for GhostPad
        address[] memory tornadoInstances = new address[](1);
        tornadoInstances[0] = address(mockTornadoInstance);
        
        // Deploy GhostPad with dependencies
        ghostPad = new GhostPad(
            address(tokenTemplate),
            deployer, // governance address
            tornadoInstances,
            address(mockUniswapHandler) // Use mock handler instead of UniswapHandler
        );
        
        // Initialize the counter for generating unique commitments
        commitmentCounter = 1;
        
        vm.stopPrank();
    }

    function testGhostPadInitialization() public {
        // Test that GhostPad was properly initialized
        assertEq(address(ghostPad.tokenTemplate()), address(tokenTemplate));
        assertEq(address(ghostPad.governance()), address(deployer));
        assertEq(address(ghostPad.uniswapHandler()), address(mockUniswapHandler));
        assertEq(ghostPad.instanceCount(), 1);
    }
    
    // Helper function to create a dummy TokenData struct for tests
    function createTestTokenData() internal pure returns (GhostPad.TokenData memory) {
        GhostPad.TokenData memory tokenData;
        tokenData.name = "Test Token";
        tokenData.symbol = "TEST";
        tokenData.initialSupply = 1000000 * 10**18; // 1M tokens
        tokenData.description = "A test token for GhostPad";
        tokenData.burnEnabled = true;
        tokenData.liquidityLockPeriod = 365 days; // 1 year
        tokenData.liquidityTokenAmount = 500000 * 10**18; // 50% of tokens for liquidity by default
        tokenData.useProtocolFee = false; // Disable protocol fee for tests to avoid balance issues
        tokenData.vestingEnabled = false; // No vesting by default
        
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
        
        return proofData;
    }
    
    // Helper function to mock a successful token deployment
    function mockTokenDeployment(address tokenAddress) internal {
        // Mock necessary calls for governance fee
        // For the real TokenTemplate, mock the allowance and transferFrom calls
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(IERC20.allowance.selector),
            abi.encode(type(uint256).max) // Return max allowance
        );

        // Mock the balanceOf call to return enough balance
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(IERC20.balanceOf.selector),
            abi.encode(10000000 * 10**18) // Return 10M tokens as balance
        );
    }
    
    // Test deploying a token with liquidity
    function testDeployTokenWithLiquidity() public {
        // First make deposits into Tornado to build up its balance
        bytes32 commitment = generateCommitment();
        
        // Give user1 ETH for deposit
        vm.deal(user1, 1 ether); 
        
        // User1 makes the deposit
        vm.prank(user1);
        mockTornadoInstance.deposit{value: 1 ether}(commitment);
        
        // Create test data
        GhostPad.TokenData memory tokenData = createTestTokenData();
        GhostPad.ProofData memory proofData = createTestProofData();
        
        // Mock all ERC20 functions that might be called
        vm.mockCall(
            address(0), // This will be filled in by Forge with the actual created token address
            abi.encodeWithSelector(IERC20.transfer.selector),
            abi.encode(true) // Return success
        );
        
        vm.mockCall(
            address(0),
            abi.encodeWithSelector(IERC20.approve.selector),
            abi.encode(true)
        );

        vm.mockCall(
            address(0),
            abi.encodeWithSelector(IERC20.balanceOf.selector),
            abi.encode(10000000 * 10**18) // Return 10M tokens as balance
        );

        vm.mockCall(
            address(0),
            abi.encodeWithSelector(IERC20.transferFrom.selector),
            abi.encode(true) // Return success
        );
        
        // Mock the addLiquidity call for the MockUniswapHandler
        vm.mockCall(
            address(mockUniswapHandler),
            abi.encodeWithSelector(MockUniswapHandler.addLiquidity.selector),
            abi.encode(1000000) // Return some liquidity amount
        );
        
        // Mock the getLiquidityInfo call for the MockUniswapHandler
        vm.mockCall(
            address(mockUniswapHandler),
            abi.encodeWithSelector(MockUniswapHandler.getLiquidityInfo.selector),
            abi.encode(mockPairAddress, false, 0, 1000) // Return mock data with our pair address
        );
        
        // Give deployer ETH for the refund (no need for liquidity ETH as it's from Tornado now)
        vm.deal(deployer, proofData.refund + 1 ether); // Just need refund + extra for gas
        
        // Deploy token with liquidity - need to call as deployer since they are the governance address
        vm.prank(deployer);
        address token = ghostPad.deployTokenWithLiquidity{value: proofData.refund}(
            tokenData,
            proofData
        );
        
        // Verify token was deployed
        assertEq(ghostPad.getDeployedToken(proofData.nullifierHash), token);
    }
    
    // Test the complete flow including deposit and withdrawal
    function testCompleteFlow() public {
        // Give user1 ETH for deposits
        vm.deal(user1, 3 ether); // 3 ETH for multiple deposits and gas
        
        // Make deposits to build the tornado contract's balance
        // User1 makes the deposits
        vm.startPrank(user1);
        
        bytes32 commitment1 = generateCommitment();
        mockTornadoInstance.deposit{value: 1 ether}(commitment1);
        
        bytes32 commitment2 = generateCommitment();
        mockTornadoInstance.deposit{value: 1 ether}(commitment2);
        
        bytes32 commitment3 = generateCommitment();
        mockTornadoInstance.deposit{value: 1 ether}(commitment3);
        
        vm.stopPrank();
        
        // Create test data for token deployment
        GhostPad.TokenData memory tokenData = createTestTokenData();
        GhostPad.ProofData memory proofData = createTestProofData();
        
        // Mock all ERC20 functions that might be called
        vm.mockCall(
            address(0),
            abi.encodeWithSelector(IERC20.transfer.selector),
            abi.encode(true)
        );
        vm.mockCall(
            address(0),
            abi.encodeWithSelector(IERC20.balanceOf.selector),
            abi.encode(10000000 * 10**18)
        );
        vm.mockCall(
            address(0),
            abi.encodeWithSelector(IERC20.transferFrom.selector),
            abi.encode(true)
        );
        
        // Deploy token - call as deployer (governance)
        vm.prank(deployer);
        address token = ghostPad.deployToken(tokenData, proofData);
        
        // Verify token was deployed
        assertEq(ghostPad.getDeployedToken(proofData.nullifierHash), token);
        assertEq(ghostPad.nullifierHashUsed(proofData.nullifierHash), true);
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
} 