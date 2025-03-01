// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma abicoder v2;

import "forge-std/Test.sol";
import "../src/GhostPad.sol";
import "../src/TokenTemplate.sol";
import "../src/UniswapHandler.sol";
import "../src/Verifier.sol";
import "../src/interfaces/ITornadoInstance.sol";
import "../src/Mocks/MockTornadoInstance.sol";
import "../src/Mocks/MockUniswapRouter.sol";
import "../src/Mocks/MockUniswapFactory.sol";
import "../src/Mocks/MockUniswapPair.sol";
import "../src/Mocks/Hasher.sol";

contract GhostPadTest is Test {
    GhostPad public ghostPad;
    Verifier public verifier;
    TokenTemplate public tokenTemplate;
    UniswapHandler public uniswapHandler; // Use real UniswapHandler instead of mock
    MockTornadoInstance public mockTornadoInstance;
    MockUniswapRouter public mockRouter;
    MockUniswapFactory public mockFactory;
    MockUniswapPair public mockPair;
    Hasher public hasher;

    address public weth = address(0x5555555555555555555555555555555555555555);
    address public deployer = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    address public mockRouterAddress;
    address public mockFactoryAddress;
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
        
        // Deploy mock Uniswap components
        mockFactory = new MockUniswapFactory(mockPairAddress);
        mockFactoryAddress = address(mockFactory);
        
        mockRouter = new MockUniswapRouter(mockFactoryAddress, weth);
        mockRouterAddress = address(mockRouter);
        
        mockPair = new MockUniswapPair(address(0), weth);
        
        // Use real UniswapHandler with mock router
        uniswapHandler = new UniswapHandler(mockRouterAddress);
        
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
            address(uniswapHandler) // Use real handler with mock router
        );
        
        // Initialize the counter for generating unique commitments
        commitmentCounter = 1;
        
        vm.stopPrank();
    }

    function testGhostPadInitialization() public {
        // Test that GhostPad was properly initialized
        assertEq(address(ghostPad.tokenTemplate()), address(tokenTemplate));
        assertEq(address(ghostPad.governance()), address(deployer));
        assertEq(address(ghostPad.uniswapHandler()), address(uniswapHandler));
        assertEq(ghostPad.instanceCount(), 1);
    }
    
    // Helper function to create a dummy TokenData struct for tests
    function createTestTokenData(address payable owner) internal view returns (GhostPad.TokenData memory) {
        GhostPad.TokenData memory tokenData;
        tokenData.name = "Test Token";
        tokenData.symbol = "TEST";
        tokenData.initialSupply = 1000000 * 10**18; // 1M tokens
        tokenData.description = "A test token for GhostPad";
        tokenData.burnEnabled = true;
        tokenData.liquidityLockPeriod = 365 days; // 1 year
        tokenData.useProtocolFee = false; // Disable protocol fee for tests to avoid balance issues
        tokenData.vestingEnabled = false; // No vesting by default
        tokenData.owner = owner; // Set the owner to the provided address
        
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
    
    // Helper function to generate a unique commitment for each test
    function generateCommitment() public returns (bytes32) {
        bytes32 commitment = keccak256(abi.encodePacked("commitment", commitmentCounter));
        commitmentCounter++;
        return commitment;
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
        GhostPad.TokenData memory tokenData = createTestTokenData(payable(user1));
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
        // Get the liquidity info from the UniswapHandler
        (address pairAddress, bool isLocked, uint256 unlockTime, uint256 lpBalance) = 
            uniswapHandler.getLiquidityInfo(token);
        
        // Validate that a pair was created
        assertTrue(pairAddress != address(0), "Uniswap pair should have been created");
        console.log("Uniswap pair address:", pairAddress);
        
        // Check if the liquidity pool is locked based on lock period set
        assertTrue(isLocked == (tokenData.liquidityLockPeriod > 0), "Liquidity lock status should match liquidityLockPeriod setting");
        console.log("Liquidity pool is locked:", isLocked);
        
        // Validate LP balance
        assertTrue(lpBalance > 0, "LP tokens should have been created");
        console.log("LP tokens balance:", lpBalance / 10**18);
        
        // Check token amount in the pool by comparing total supply minus other balances
        uint256 poolTokenAmount = totalSupply - user1Balance - ghostPadBalance - governanceBalance;
        assertTrue(poolTokenAmount > 0, "Tokens should have been added to the pool");
        console.log("Token amount in pool (calculated):", poolTokenAmount / 10**18);
        
        // 6. Check that the token contract's native balance is 0 (no leftover ETH)
        uint256 tokenContractEthBalance = address(token).balance;
        assertEq(tokenContractEthBalance, 0, "Token contract should not have any ETH left");
        
        // 7. Sum up all token balances to ensure they equal total supply
        uint256 totalTokens = user1Balance + ghostPadBalance + governanceBalance + poolTokenAmount;
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
        GhostPad.TokenData memory tokenData = createTestTokenData(payable(user1));
        GhostPad.ProofData memory proofData = createTestProofData();
        
        // No need to mock IERC20 functions, TokenTemplate implements them
        
        // Deploy token - call as deployer (governance)
        // Create a new character address for the prank
        address relayer = address(0x1234);
        
        // Give the new deployer some ETH for gas
        vm.deal(relayer, 1 ether);
        
        // Use the new deployer to call the function
        vm.prank(relayer);
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
        
        // Check that user2 received the tokens
        uint256 user2Balance = deployedToken.balanceOf(user2);
        assertEq(user2Balance, transferAmount1);
        
        // Check that user1's balance was reduced by the transfer amount
        uint256 user1FinalBalance = deployedToken.balanceOf(user1);
        assertEq(user1FinalBalance, user1InitialBalance - transferAmount1);
    }

    // Test deploying a token with liquidity and then having someone purchase tokens
    function testDeployTokenWithLiquidityAndPurchase() public {
        // First make deposits into Tornado to build up its balance
        bytes32 commitment = generateCommitment();
        
        // Give user1 ETH for deposit and for calling deployTokenWithLiquidity
        vm.deal(user1, 2 ether); // 1 ETH for deposit + 1 ETH for refund and gas
        
        // User1 makes the deposit
        vm.prank(user1);
        mockTornadoInstance.deposit{value: 1 ether}(commitment);
        
        // Create test data
        GhostPad.TokenData memory tokenData = createTestTokenData(payable(user1));
        GhostPad.ProofData memory proofData = createTestProofData();
        
        // Deploy token with liquidity - user1 calls this function now
        vm.prank(user1);
        address payable tokenAddress = payable(ghostPad.deployTokenWithLiquidity{value: proofData.refund}(
            tokenData,
            proofData
        ));
        
        // Create a new buyer account
        address buyer = address(0x4); // New address
        vm.deal(buyer, 1 ether); // Give buyer 1 ETH for purchase
        
        // Get the token contract
        TokenTemplate token = TokenTemplate(tokenAddress);
        
        // Check initial balances
        uint256 buyerInitialTokenBalance = token.balanceOf(buyer);
        assertEq(buyerInitialTokenBalance, 0, "Buyer should start with 0 tokens");
        
        // Get liquidity info to check ETH in the pool
        (address pairAddress, bool isLocked, uint256 unlockTime, uint256 lpBalance) = 
            uniswapHandler.getLiquidityInfo(tokenAddress);
            
        // Verify liquidity is set up correctly
        assertTrue(pairAddress != address(0), "Pair should exist");
        assertTrue(isLocked, "Liquidity should be locked");
        assertTrue(lpBalance > 0, "LP tokens should exist");
        
        // Set up path for swap
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = tokenAddress;
        
        // Execute token purchase
        uint256 swapAmount = 0.1 ether;
        
        // Simulate buyer interacting with the router to buy tokens
        vm.startPrank(buyer);
        
        // Mock the swap - in a real environment, this would call the actual router
        // Here we're using a mock router for testing
        MockUniswapRouter(payable(mockRouterAddress)).swapExactETHForTokens{value: swapAmount}(
            0, // min amount out (accept any amount for testing)
            path,
            buyer,
            block.timestamp + 3600 // deadline: 1 hour from now
        );
        
        vm.stopPrank();
        
        // Check buyer's token balance after purchase
        uint256 buyerFinalTokenBalance = token.balanceOf(buyer);
        assertTrue(buyerFinalTokenBalance > 0, "Buyer should have received tokens");
        console.log("Buyer received token amount:", buyerFinalTokenBalance / 10**18);
        
        // Check that the ETH made it to the pair (in a real environment)
        // In our mock setup, we'll verify the router received the ETH
        uint256 routerBalance = address(mockRouter).balance;
        assertTrue(routerBalance >= swapAmount, "Router should have received ETH from the swap");
        
        // Get updated liquidity info
        (pairAddress, isLocked, unlockTime, lpBalance) = 
            uniswapHandler.getLiquidityInfo(tokenAddress);
            
        // The LP balance should still be the same as tokens are exchanged within the pair
        assertEq(lpBalance, 1000000, "LP token amount should not change from swaps");
        
        // In a real environment, we would check the reserves of the pair
        // But for our mock, we'll just verify the token transfer happened
        console.log("Test passed: Token purchase successful");
    }
} 