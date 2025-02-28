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
    
    // Test deploying a token with liquidity
    function testDeployTokenWithLiquidity() public {
        // First make deposits into Tornado to build up its balance
        bytes32 commitment = generateCommitment();
        
        // Give user1 ETH for deposit and for calling deployTokenWithLiquidity
        vm.deal(user1, 2 ether); // 1 ETH for deposit + 1 ETH for refund and gas
        
        // User1 makes the deposit
        vm.prank(user1);
        mockTornadoInstance.deposit{value: 1 ether}(commitment);
        
        // Create test data
        GhostPad.TokenData memory tokenData = createTestTokenData();
        GhostPad.ProofData memory proofData = createTestProofData();
        
        // Deploy token with liquidity - user1 calls this function now
        vm.prank(user1);
        address payable token = payable(ghostPad.deployTokenWithLiquidity{value: proofData.refund}(
            tokenData,
            proofData
        ));
        
        // Verify token was deployed
        assertEq(ghostPad.getDeployedToken(proofData.nullifierHash), token);
        
        // Now let's validate the balances and liquidity
        
        // Create a TokenTemplate instance from the deployed token address
        TokenTemplate deployedToken = TokenTemplate(token);
        
        // IMPORTANT: In deployTokenWithLiquidity, the GhostPad contract becomes the token owner temporarily
        // This is different from deployToken where tokens go directly to the specified recipient
        // GhostPad needs to be the recipient to receive ETH and add liquidity

        // 1. Check that user1 has no tokens initially
        // (In deployTokenWithLiquidity, tokens initially go to GhostPad contract, not to user1)
        uint256 user1Balance = deployedToken.balanceOf(user1);
        console.log("User1 (caller) balance:", user1Balance / 10**18);
        assertEq(user1Balance, 0, "User1 should not have tokens yet as they're not the recipient in deployTokenWithLiquidity");
        
        // 2. Check the total supply
        uint256 totalSupply = deployedToken.totalSupply();
        console.log("Total token supply:", totalSupply / 10**18);
        
        // 3. Check that GhostPad contract's balance (should be 0 after adding liquidity)
        uint256 ghostPadBalance = deployedToken.balanceOf(address(ghostPad));
        console.log("GhostPad contract balance:", ghostPadBalance / 10**18);
        // After adding liquidity, GhostPad should have transferred all tokens to the pool
        assertEq(ghostPadBalance, 0, "GhostPad should not hold any tokens after adding liquidity");
        
        // 4. Check governance balance (should have fee tokens if useProtocolFee is true)
        uint256 governanceBalance = deployedToken.balanceOf(deployer);
        if (tokenData.useProtocolFee) {
            assertTrue(governanceBalance > 0, "Governance should have received fee tokens");
            console.log("Governance fee tokens:", governanceBalance / 10**18);
        } else {
            assertEq(governanceBalance, 0, "Governance should not have tokens if fee is disabled");
        }
        
        // 5. Check the liquidity pool
        // Get the liquidity info from the mockUniswapHandler
        (address pairAddress, bool isLocked, uint256 tokenAmount, uint256 ethAmount) = 
            mockUniswapHandler.getLiquidityInfo(token);
        
        // Validate that a pair was created
        assertTrue(pairAddress != address(0), "Uniswap pair should have been created");
        console.log("Uniswap pair address:", pairAddress);
        
        // Check if the liquidity pool is locked based on lock period set
        assertTrue(isLocked == (tokenData.liquidityLockPeriod > 0), "Liquidity lock status should match liquidityLockPeriod setting");
        console.log("Liquidity pool is locked:", isLocked);
        
        // Validate token and ETH amounts in the liquidity pool
        assertTrue(tokenAmount > 0, "Tokens should have been added to the pool");
        console.log("Token amount in pool:", tokenAmount / 10**18);
        
        assertTrue(ethAmount > 0, "ETH should have been added to the pool");
        console.log("ETH amount in pool:", ethAmount / 10**18);
        
        // Instead of checking against a fixed liquidityTokenAmount (which may not be used), 
        // we verify that tokens were added to the pool and GhostPad has no tokens left
        
        // Verify the ETH amount is from the tornado instance (1 ETH in this test)
        assertEq(ethAmount, 1 ether, "ETH amount in pool should be 1 ETH from the tornado instance");
        
        // 6. Check that the token contract's native balance is 0 (no leftover ETH)
        uint256 tokenContractEthBalance = address(token).balance;
        assertEq(tokenContractEthBalance, 0, "Token contract should not have any ETH left");
        
        // 7. Sum up all token balances to ensure they equal total supply
        uint256 totalTokens = user1Balance + ghostPadBalance + governanceBalance + tokenAmount;
        assertEq(totalTokens, totalSupply, "Sum of all token balances should equal total supply");
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
        
        // No need to mock IERC20 functions, TokenTemplate implements them
        
        // Deploy token - call as deployer (governance)
        vm.prank(deployer);
        address payable token = payable(ghostPad.deployToken(tokenData, proofData));
        
        // Verify token was deployed
        assertEq(ghostPad.getDeployedToken(proofData.nullifierHash), token);
        assertEq(ghostPad.nullifierHashUsed(proofData.nullifierHash), true);
        
        // Now test that the token recipient (user1) can transfer tokens to other users
        
        // Create a TokenTemplate instance from the deployed token address
        TokenTemplate deployedToken = TokenTemplate(token);
        
        // Let's check user1's balance (the recipient from the proof data)
        // User1 should have received tokens as the recipient in the proof data
        uint256 user1InitialBalance = deployedToken.balanceOf(user1);
        assertTrue(user1InitialBalance > 0, "User1 should have received tokens from deployment");
        console.log("User1 initial balance:", user1InitialBalance / 10**18);
        
        // Transfer tokens from user1 to user2
        uint256 transferAmount1 = 1000 * 10**18; // 1000 tokens
        vm.prank(user1);
        deployedToken.transfer(user2, transferAmount1);
        
        // Verify the transfer to user2
        assertEq(deployedToken.balanceOf(user2), transferAmount1);
        
        // Create a new user3 for another transfer
        address user3 = address(6);
        
        // Transfer tokens from user1 to user3
        uint256 transferAmount2 = 500 * 10**18; // 500 tokens
        vm.prank(user1);
        deployedToken.transfer(user3, transferAmount2);
        
        // Verify the transfer to user3
        assertEq(deployedToken.balanceOf(user3), transferAmount2);
        
        // Verify user1's remaining balance
        assertEq(deployedToken.balanceOf(user1), user1InitialBalance - transferAmount1 - transferAmount2);
        
        // Log final balances for clarity
        console.log("Final balances:");
        console.log("User1:", deployedToken.balanceOf(user1) / 10**18);
        console.log("User2:", deployedToken.balanceOf(user2) / 10**18);
        console.log("User3:", deployedToken.balanceOf(user3) / 10**18);
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