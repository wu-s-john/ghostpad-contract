// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

import "forge-std/Test.sol";
import "../src/TokenTemplate.sol";

contract TokenTemplateTest is Test {
    TokenTemplate public tokenTemplate;
    
    // Test addresses
    address public deployer = address(1);
    address public owner = address(2);
    address public user1 = address(3);
    address public user2 = address(4);
    
    // Test parameters
    string public name = "Test Token";
    string public symbol = "TEST";
    uint256 public initialSupply = 1_000_000 * 10**18; // 1 million tokens with 18 decimals
    string public description = "Test token description";
    bool public burnEnabled = true;
    uint256 public liquidityLockPeriod = 30 days;
    bool public vestingEnabled = true;
    
    function setUp() public {
        vm.startPrank(deployer);
        
        // Deploy TokenTemplate
        tokenTemplate = new TokenTemplate();
        
        vm.stopPrank();
    }

    function testInitialization() public {
        vm.startPrank(deployer);
        
        // Initialize the token with 0 ETH amount (default 50% distribution)
        tokenTemplate.initialize(
            name,
            symbol,
            initialSupply,
            owner,
            description,
            burnEnabled,
            liquidityLockPeriod,
            vestingEnabled,
            0 // ethAmount = 0, should default to 50% for owner
        );
        
        vm.stopPrank();
        
        // Verify token initialization
        assertEq(tokenTemplate.name(), name);
        assertEq(tokenTemplate.symbol(), symbol);
        assertEq(tokenTemplate.description(), description);
        assertEq(tokenTemplate.burnEnabled(), burnEnabled);
        assertEq(tokenTemplate.liquidityLockPeriod(), liquidityLockPeriod);
        assertEq(tokenTemplate.vestingEnabled(), vestingEnabled);
        assertEq(tokenTemplate.owner(), owner);
        
        // Check token distribution
        // With ethAmount=0, the default is 50% (5000 basis points) to owner
        uint256 ownerPercentage = 5000; // Default 50%
        uint256 ownerAmount = initialSupply * ownerPercentage / 10000;
        uint256 contractAmount = initialSupply - ownerAmount;
        
        assertEq(tokenTemplate.balanceOf(owner), ownerAmount);
        assertEq(tokenTemplate.balanceOf(address(tokenTemplate)), contractAmount);
        assertEq(tokenTemplate.totalSupply(), initialSupply);
    }

    function testInitializationWithEthAmount() public {
        vm.startPrank(deployer);
        
        // Initialize the token with 1 ETH amount
        tokenTemplate.initialize(
            name,
            symbol,
            initialSupply,
            owner,
            description,
            burnEnabled,
            liquidityLockPeriod,
            vestingEnabled,
            1 ether // Pass 1 ETH amount directly
        );
        
        vm.stopPrank();
        
        // Verify token initialization
        assertEq(tokenTemplate.name(), name);
        assertEq(tokenTemplate.symbol(), symbol);
        
        // With 1 ETH amount, the owner percentage should be calculated using the formula
        uint256 expectedOwnerPercentage = tokenTemplate.calculateOwnerPercentage(1 ether);
        uint256 ownerAmount = initialSupply * expectedOwnerPercentage / 10000;
        uint256 contractAmount = initialSupply - ownerAmount;
        
        console.log("Expected owner percentage with 1 ETH:", expectedOwnerPercentage);
        console.log("Owner amount:", ownerAmount);
        
        // Verify the token distribution
        assertEq(tokenTemplate.balanceOf(owner), ownerAmount);
        assertEq(tokenTemplate.balanceOf(address(tokenTemplate)), contractAmount);
    }
    
    function testTransfer() public {
        // Initialize the token first
        vm.prank(deployer);
        tokenTemplate.initialize(
            name,
            symbol,
            initialSupply,
            owner,
            description,
            burnEnabled,
            liquidityLockPeriod,
            vestingEnabled,
            0 // Default distribution
        );
        
        // Check initial balances
        uint256 ownerPercentage = 5000; // Default 50%
        uint256 ownerAmount = initialSupply * ownerPercentage / 10000;
        
        // Transfer some tokens from owner to user1
        uint256 transferAmount = 1000 * 10**18; // 1000 tokens
        vm.prank(owner);
        tokenTemplate.transfer(user1, transferAmount);
        
        // Verify the transfer
        assertEq(tokenTemplate.balanceOf(user1), transferAmount);
        assertEq(tokenTemplate.balanceOf(owner), ownerAmount - transferAmount);
        
        // Now user1 transfers to user2
        vm.prank(user1);
        tokenTemplate.transfer(user2, 500 * 10**18); // 500 tokens
        
        // Verify the transfer
        assertEq(tokenTemplate.balanceOf(user1), 500 * 10**18);
        assertEq(tokenTemplate.balanceOf(user2), 500 * 10**18);
    }
    
    function testTransferFrom() public {
        // Initialize the token first
        vm.prank(deployer);
        tokenTemplate.initialize(
            name,
            symbol,
            initialSupply,
            owner,
            description,
            burnEnabled,
            liquidityLockPeriod,
            vestingEnabled,
            0 // Default distribution
        );
        
        // Check initial balances
        uint256 ownerPercentage = 5000; // Default 50%
        uint256 ownerAmount = initialSupply * ownerPercentage / 10000;
        
        // Transfer some tokens from owner to user1
        uint256 transferAmount = 1000 * 10**18; // 1000 tokens
        vm.prank(owner);
        tokenTemplate.transfer(user1, transferAmount);
        
        // User1 approves user2 to spend tokens
        uint256 approvalAmount = 600 * 10**18; // 600 tokens
        vm.prank(user1);
        tokenTemplate.approve(user2, approvalAmount);
        
        // User2 transfers from user1 to themselves
        uint256 transferFromAmount = 500 * 10**18; // 500 tokens
        vm.prank(user2);
        tokenTemplate.transferFrom(user1, user2, transferFromAmount);
        
        // Verify the transferFrom
        assertEq(tokenTemplate.balanceOf(user1), transferAmount - transferFromAmount);
        assertEq(tokenTemplate.balanceOf(user2), transferFromAmount);
        
        // Check remaining allowance
        assertEq(tokenTemplate.allowance(user1, user2), approvalAmount - transferFromAmount);
    }
    
    function testCalculateOwnerPercentage() public {
        // Test with various ETH amounts to make sure the formula works correctly
        uint256 percentage0_1ETH = tokenTemplate.calculateOwnerPercentage(0.1 ether);
        uint256 percentage1ETH = tokenTemplate.calculateOwnerPercentage(1 ether);
        uint256 percentage10ETH = tokenTemplate.calculateOwnerPercentage(10 ether);
        uint256 percentage100ETH = tokenTemplate.calculateOwnerPercentage(100 ether);
        
        console.log("Owner percentage for 0.1 ETH:", percentage0_1ETH);
        console.log("Owner percentage for 1 ETH:", percentage1ETH);
        console.log("Owner percentage for 10 ETH:", percentage10ETH);
        console.log("Owner percentage for 100 ETH:", percentage100ETH);
        
        // Verify the percentages follow the step function in the contract
        // According to the implementation:
        // 0.1 ETH -> 375 (3.75%)
        // 1 ETH -> 500 (5%)
        // 10 ETH -> 1000 (10%)
        // 100 ETH -> 5000 (50%)
        
        // Check exact values based on the step function
        assertEq(percentage0_1ETH, 375);
        assertEq(percentage1ETH, 500);
        assertEq(percentage10ETH, 1000);
        assertEq(percentage100ETH, 5000);
        
        // Also verify the step function's general behavior
        assertTrue(percentage0_1ETH < percentage1ETH, "0.1 ETH should give smaller percentage than 1 ETH");
        assertTrue(percentage1ETH < percentage10ETH, "1 ETH should give smaller percentage than 10 ETH");
        assertTrue(percentage10ETH < percentage100ETH, "10 ETH should give smaller percentage than 100 ETH");
    }

    function testMultipleTransfers() public {
        // Initialize the token
        vm.prank(deployer);
        tokenTemplate.initialize(
            name,
            symbol,
            initialSupply,
            owner,
            description,
            burnEnabled,
            liquidityLockPeriod,
            vestingEnabled,
            0 // Default distribution
        );
        
        // Check initial balances
        uint256 ownerPercentage = 5000; // Default 50%
        uint256 ownerAmount = initialSupply * ownerPercentage / 10000;
        
        // Owner sends 1000 tokens to user1
        uint256 transferAmount1 = 1000 * 10**18;
        vm.prank(owner);
        tokenTemplate.transfer(user1, transferAmount1);
        
        // User1 sends 600 tokens to user2
        uint256 transferAmount2 = 600 * 10**18;
        vm.prank(user1);
        tokenTemplate.transfer(user2, transferAmount2);
        
        // User2 sends 300 tokens to a new address (user3)
        address user3 = address(6);
        uint256 transferAmount3 = 300 * 10**18;
        vm.prank(user2);
        tokenTemplate.transfer(user3, transferAmount3);
        
        // Verify final balances
        assertEq(tokenTemplate.balanceOf(user1), transferAmount1 - transferAmount2);
        assertEq(tokenTemplate.balanceOf(user2), transferAmount2 - transferAmount3);
        assertEq(tokenTemplate.balanceOf(user3), transferAmount3);
        
        // Log final balances for clarity
        console.log("Final user1 balance:", tokenTemplate.balanceOf(user1) / 10**18);
        console.log("Final user2 balance:", tokenTemplate.balanceOf(user2) / 10**18);
        console.log("Final user3 balance:", tokenTemplate.balanceOf(user3) / 10**18);
    }
} 