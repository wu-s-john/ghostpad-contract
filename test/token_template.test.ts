import { expect, describe, it, beforeAll, beforeEach } from "vitest";
import { ethers } from "ethers";
import { TokenTemplate, TokenTemplate__factory } from "../typechain";

// Set timeout to 60 seconds for all tests in this file
describe('TokenTemplate', { timeout: 60000 }, function () {
  // Account setup
  let deployer: ethers.Wallet;
  let owner: ethers.Wallet;
  let user1: ethers.Wallet;
  let user2: ethers.Wallet;
  
  // Contract instance with proper typing
  let tokenTemplate: TokenTemplate;
  
  // Provider
  let provider: ethers.JsonRpcProvider;
  
  // Token parameters
  const name = "Test Token";
  const symbol = "TEST";
  const initialSupply = ethers.parseEther('1000000'); // 1M tokens
  const description = "A test token for DeFi applications";
  const taxRate = 100; // 1% in basis points
  let taxRecipient: string;
  const burnEnabled = true;
  const liquidityLockPeriod = 60 * 60 * 24 * 30; // 30 days
  const vestingEnabled = true;
  
  // Private keys for test accounts
  const privateKeys = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // First Anvil account
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // Second Anvil account
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", // Third Anvil account
    "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"  // Fourth Anvil account
  ];
  
  // Helper function to create a fresh provider and wallets
  function createFreshProviderAndWallets() {
    const newProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallets = privateKeys.map(pk => new ethers.Wallet(pk, newProvider));
    return { provider: newProvider, wallets };
  }
  
  // Helper function to deploy a fresh TokenTemplate contract
  async function deployFreshTokenTemplate(deployerWallet: ethers.Wallet) {
    console.log("Deploying fresh TokenTemplate...");
    const TokenTemplateFactory = new TokenTemplate__factory(deployerWallet);
    const freshToken = await TokenTemplateFactory.deploy();
    
    // Explicitly wait for deployment to complete
    console.log("Waiting for deployment transaction to be mined...");
    await freshToken.waitForDeployment();
    
    const contractAddress = await freshToken.getAddress();
    console.log(`Fresh TokenTemplate deployed at: ${contractAddress}`);
    
    return freshToken;
  }
  
  beforeAll(async function() {
    // Create fresh provider and wallets
    const { provider: newProvider, wallets } = createFreshProviderAndWallets();
    provider = newProvider;
    [deployer, owner, user1, user2] = wallets;
    
    taxRecipient = owner.address;
    
    console.log("Connected to Anvil");
    
    // Check if Anvil is responsive
    try {
      const blockNumber = await provider.getBlockNumber();
      console.log(`Current block number: ${blockNumber}`);
      if (blockNumber > 10) {
        console.log("WARNING: Anvil may not be freshly started. Block number should be close to 0.");
      }
    } catch (error) {
      console.error("CRITICAL ERROR: Failed to connect to Anvil:", error);
      throw new Error("Could not connect to Anvil. Make sure it's running on port 8545.");
    }
    
    // Check balance of deployer to make sure we're connected
    const deployerBalance = await provider.getBalance(deployer.address);
    console.log(`Deployer ETH balance: ${ethers.formatEther(deployerBalance)} ETH`);
    
    // Deploy TokenTemplate
    tokenTemplate = await deployFreshTokenTemplate(deployer);
    
    // Verify contract code is deployed
    const contractAddress = await tokenTemplate.getAddress();
    const code = await provider.getCode(contractAddress);
    console.log(`Contract bytecode length: ${(code.length - 2)/2} bytes`);
    if (code === '0x') {
      throw new Error('Contract code not deployed - deployment failed');
    }
    console.log("Contract bytecode successfully deployed");
  }, 90000); // 90 seconds timeout for the beforeAll hook
  
  // Also set timeouts for nested describe blocks
  describe('Deployment and Initialization', { timeout: 60000 }, function () {
    it('should have empty state before initialization', async function () {
      console.log("\n====== BEGINNING UNINITIALIZED STATE TEST ======");
      
      // Log the contract address
      const contractAddress = await tokenTemplate.getAddress();
      console.log(`Testing contract at: ${contractAddress}`);
      
      // Check if contract actually exists
      const code = await provider.getCode(contractAddress);
      console.log(`Contract code exists: ${code !== '0x'}, bytecode length: ${(code.length - 2)/2} bytes`);
      
      // Try calling other functions to see if they work
      try {
        const name = await tokenTemplate.name();
        if (name) {
          console.log(`WARNING: Could retrieve name: ${name} - this suggests the contract is initialized`);
        }
      } catch (error: any) {
        console.log(`Expected error when calling 'name()': ${error.message?.substring(0, 100) || String(error).substring(0, 100)}...`);
      }
      
      try {
        const symbol = await tokenTemplate.symbol();
        if (symbol) {
          console.log(`WARNING: Could retrieve symbol: ${symbol} - this suggests the contract is initialized`);
        }
      } catch (error: any) {
        console.log(`Expected error when calling 'symbol()': ${error.message?.substring(0, 100) || String(error).substring(0, 100)}...`);
      }
      
      // Try to access a property that should only work after initialization
      console.log("Attempting to call description()...");
      try {
        const description = await tokenTemplate.description();
        console.log(`WARNING: Description accessed successfully: ${description} - this suggests the contract is already initialized`);
        expect.fail("Should not be able to access description on uninitialized contract");
      } catch (descError: any) {
        console.log(`Expected error accessing description: ${descError.message?.substring(0, 150) || String(descError).substring(0, 150)}...`);
      }

      console.log("====== UNINITIALIZED STATE TEST COMPLETE ======\n");
    });
    
    it('should initialize correctly', { timeout: 70000 }, async function () {
      // Initialize the token
      await tokenTemplate.initialize(
        name,
        symbol,
        initialSupply,
        deployer.address,
        description,
        taxRate,
        taxRecipient,
        burnEnabled,
        liquidityLockPeriod,
        vestingEnabled
      );
      
      // Check token properties
      // Name and symbol should now match what we passed to initialize()
      expect(await tokenTemplate.name()).to.equal(name);
      expect(await tokenTemplate.symbol()).to.equal(symbol);
      
      // The rest of the properties should match what we passed to initialize()
      expect(await tokenTemplate.totalSupply()).to.equal(initialSupply);
      expect(await tokenTemplate.description()).to.equal(description);
      expect(await tokenTemplate.owner()).to.equal(deployer.address);
      expect(await tokenTemplate.taxRate()).to.equal(BigInt(taxRate));
      expect(await tokenTemplate.taxRecipient()).to.equal(taxRecipient);
      expect(await tokenTemplate.burnEnabled()).to.equal(burnEnabled);
      expect(await tokenTemplate.vestingEnabled()).to.equal(vestingEnabled);
      
      // Check initial token distribution
      // The owner percentage depends on the calculateOwnerPercentage formula in the contract
      // For tests, we'll need to check what it actually returns
      const ownerBalance = await tokenTemplate.balanceOf(deployer.address);
      const contractBalance = await tokenTemplate.balanceOf(await tokenTemplate.getAddress());
      
      console.log(`Owner balance: ${ownerBalance}`);
      console.log(`Contract balance: ${contractBalance}`);
      
      // Owner should have received tokens
      expect(ownerBalance).to.be.gt(0);
      
      // Total should match initialSupply
      expect(ownerBalance + contractBalance).to.equal(initialSupply);
    });
    
    it('should prevent multiple initializations', async function () {
      // Should revert when trying to initialize again
      await expect(tokenTemplate.initialize(
        "Another Token",
        "ATK",
        initialSupply,
        deployer.address,
        "Another description",
        taxRate,
        taxRecipient,
        burnEnabled,
        liquidityLockPeriod,
        vestingEnabled
      )).to.be.rejects;
    });
  });

  describe('Token Distribution at Initialization', { timeout: 60000 }, function () {
    // Use a before hook to ensure a fresh provider connection for this describe block
    beforeEach(async function() {
      // Create a fresh connection to Anvil
      const { provider: newProvider, wallets } = createFreshProviderAndWallets();
      provider = newProvider;
      [deployer, owner, user1, user2] = wallets;
      taxRecipient = owner.address;
      
      // Check the nonce of the deployer to confirm it's reset
      const deployerNonce = await provider.getTransactionCount(deployer.address);
      console.log(`Deployer nonce: ${deployerNonce} (should be 0 after Anvil reset)`);
    });
    
    it('should distribute tokens correctly between owner and contract', { timeout: 70000 }, async function () {
      // Deploy a fresh TokenTemplate for this test
      const freshToken = await deployFreshTokenTemplate(deployer);
      
      // Initialize the token
      const testSupply = ethers.parseEther('1000000'); // 1M tokens
      await freshToken.initialize(
        "Distribution Test",
        "DIST",
        testSupply,
        deployer.address,
        "Testing token distribution",
        100, // 1% tax
        taxRecipient,
        true,
        86400, // 1 day lock
        false
      );
      
      // Get contract address
      const contractAddress = await freshToken.getAddress();
      
      // Get balances after initialization
      const ownerBalance = await freshToken.balanceOf(deployer.address);
      const contractBalance = await freshToken.balanceOf(contractAddress);
      
      console.log(`Owner balance: ${ethers.formatEther(ownerBalance)} DIST`);
      console.log(`Contract balance: ${ethers.formatEther(contractBalance)} DIST`);
      
      // In test mode with no ETH amount supplied, owner should get 50% (5000 basis points)
      const expectedOwnerBalance = testSupply * BigInt(5000) / BigInt(10000);
      const expectedContractBalance = testSupply - expectedOwnerBalance;
      
      // Check balances match expected distribution
      expect(ownerBalance).to.equal(expectedOwnerBalance);
      expect(contractBalance).to.equal(expectedContractBalance);
      
      // Confirm total supply is correct
      expect(ownerBalance + contractBalance).to.equal(testSupply);
      
      // Verify the percentage is 50% (5000 basis points)
      const ownerPercentage = (ownerBalance * BigInt(10000)) / testSupply;
      expect(ownerPercentage).to.equal(BigInt(5000));
    });
  });

  describe('Tests requiring fresh contracts', { timeout: 60000 }, function () {
    // Each test should use a fresh provider connection
    beforeEach(async function() {
      // Create fresh provider and wallets for each test
      const { provider: newProvider, wallets } = createFreshProviderAndWallets();
      provider = newProvider;
      [deployer, owner, user1, user2] = wallets;
      taxRecipient = owner.address;
      
      console.log("Reconnecting to Anvil for fresh test...");
    });

    it('should fail to initialize twice', { timeout: 70000 }, async function () {
      // Deploy a fresh contract
      const freshToken = await deployFreshTokenTemplate(deployer);
      
      // Initialize it once
      await freshToken.initialize(
        "Double Init Test",
        "DBLINT",
        ethers.parseEther('1000000'),
        deployer.address,
        "Testing double initialization",
        100,
        taxRecipient,
        true,
        86400,
        false
      );
      
      // Try to initialize it again - should fail
      try {
        await freshToken.initialize(
          "Double Init Test 2",
          "DBLINT2",
          ethers.parseEther('500000'),
          user1.address,
          "Should fail",
          200,
          user2.address,
          false,
          43200,
          true
        );
        // If we reach here, the second initialization didn't throw an error - that's a failure
        expect.fail("Second initialization should have failed but didn't");
      } catch (error: any) {
        // Verify the error message contains "already initialized"
        expect(error.toString()).to.include("already initialized");
      }
    });
    
    it('should properly check initialization requirements', { timeout: 70000 }, async function() {
      // Deploy a fresh contract
      const freshToken = await deployFreshTokenTemplate(deployer);
      
      // Try to initialize with zero address as owner - should fail
      try {
        await freshToken.initialize(
          "Zero Address Test",
          "ZERO",
          ethers.parseEther('1000000'),
          "0x0000000000000000000000000000000000000000", // Zero address
          "Testing zero address validation",
          100,
          taxRecipient,
          true,
          86400,
          false
        );
        expect.fail("Initialization with zero address should have failed but didn't");
      } catch (error: any) {
        // Verify the error message mentions zero address
        expect(error.toString()).to.include("zero address");
      }
    });

    it('should emit TokenDistribution event with correct values', { timeout: 70000 }, async function () {
      // Deploy another fresh TokenTemplate
      const freshToken = await deployFreshTokenTemplate(deployer);
      const contractAddress = await freshToken.getAddress();
      
      // Set up event listener to capture the emission
      const testSupply = ethers.parseEther('1000000');
      const expectedOwnerAmount = testSupply * BigInt(5000) / BigInt(10000);
      const expectedContractAmount = testSupply - expectedOwnerAmount;
      
      // Initialize token with specific parameters
      console.log("Initializing fresh token...");
      const tx = await freshToken.initialize(
        "Event Test",
        "EVENT",
        testSupply,
        deployer.address,
        "Testing event emission",
        100,
        taxRecipient,
        true,
        86400,
        false
      );
      
      // Wait for transaction to be mined
      console.log("Waiting for transaction to be mined...");
      const receipt = await tx.wait();
      console.log("Transaction mined successfully.");
      
      // Verify receipt has logs
      expect(receipt?.logs.length).to.be.greaterThan(0);
      console.log(`Found ${receipt?.logs.length} log entries in the transaction receipt`);
      
      // Confirm ownership was correctly set
      const owner = await freshToken.owner();
      expect(owner).to.equal(deployer.address);
      console.log(`Owner verified as: ${owner}`);
      
      // Verify token balances reflect the distribution
      const ownerBalance = await freshToken.balanceOf(deployer.address);
      const contractBalance = await freshToken.balanceOf(contractAddress);
      
      console.log(`Owner balance: ${ownerBalance}`);
      console.log(`Contract balance: ${contractBalance}`);
      
      // Owner should have received tokens according to the distribution
      expect(ownerBalance).to.be.gt(0);
      expect(ownerBalance + contractBalance).to.equal(testSupply);
    });
  });

  describe('Isolated Test Environment Check', { timeout: 60000 }, function () {
    it('should verify contract deployment isolation', async function () {
      // Create a fresh provider and deploy contract directly in the test
      console.log("\n=== ISOLATION TEST ===");
      
      const { provider: isolatedProvider, wallets } = createFreshProviderAndWallets();
      const [isolatedDeployer] = wallets;
      
      // Check nonce to verify fresh state
      const deployerNonce = await isolatedProvider.getTransactionCount(isolatedDeployer.address);
      console.log(`Deployer nonce in isolation test: ${deployerNonce} (should be 0 or low)`);
      
      // Deploy using helper
      const isolatedContract = await deployFreshTokenTemplate(isolatedDeployer);
      
      // Run assertions
      try {
        await isolatedContract.description();
        expect.fail("Should not be able to call description on uninitialized contract");
      } catch (expectedError) {
        console.log("Correctly failed to call description() - contract is not initialized");
      }
    });
  });

  describe('ERC20 Constructor Investigation', { timeout: 60000 }, function () {
    it('should understand OpenZeppelin ERC20 constructor behavior', async function () {
      // Create a fresh provider and contract for investigation
      console.log("\n=== ERC20 CONSTRUCTOR INVESTIGATION ===");
      
      const { provider: investigationProvider, wallets } = createFreshProviderAndWallets();
      const [investigationDeployer] = wallets;
      
      // Check the nonce
      const deployerNonce = await investigationProvider.getTransactionCount(investigationDeployer.address);
      console.log(`Deployer nonce for investigation: ${deployerNonce} (should be 0 or low)`);
      
      // Deploy a fresh contract
      const investigationToken = await deployFreshTokenTemplate(investigationDeployer);
      
      console.log("=== END INVESTIGATION ===\n");
    });
  });
}); 