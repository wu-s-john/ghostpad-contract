const TokenTemplate = artifacts.require("TokenTemplate");
const MetadataVerifier = artifacts.require("MetadataVerifier");
const GhostPad = artifacts.require("GhostPad");
const ETHTornado = artifacts.require("ETHTornado");
const Verifier = artifacts.require("Verifier");
const Hasher = artifacts.require("Hasher");
const UniswapHandler = artifacts.require("UniswapHandler");

const { BN, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const crypto = require('crypto');

/**
 * This test demonstrates the complete flow of using GhostPad from the user's perspective:
 * 1. Deposit to Tornado Cash
 * 2. Generate proofs
 * 3. Deploy a memecoin with custom properties
 * 4. Test the deployed memecoin features
 */
contract('GhostPad Example Usage', function (accounts) {
  // Account setup
  const deployer = accounts[0];
  const recipient = accounts[1];
  const relayer = accounts[2];
  const governance = accounts[3];
  const user1 = accounts[4];
  const user2 = accounts[5];
  
  // Token properties
  const tokenName = "Ghost Memecoin";
  const tokenSymbol = "GHOST";
  const tokenSupply = web3.utils.toWei('1000000');
  const tokenDescription = "A privacy-focused memecoin launched anonymously through GhostPad";
  const taxRate = 100; // 1% in basis points
  const taxRecipient = recipient; // The owner will receive the tax
  const burnEnabled = true; // Allow token burning
  const liquidityLockPeriod = 365 * 24 * 60 * 60; // 1 year
  
  // Deployment properties
  const instanceIndex = 0; // Use the smallest denomination (0.1 ETH)
  const fee = web3.utils.toWei('0.001'); // Relayer fee
  const refund = web3.utils.toWei('0'); // Refund amount
  
  // Contract instances
  let tokenTemplate;
  let metadataVerifier;
  let tornadoInstance;
  let ghostPad;
  let uniswapHandler;
  let deployedToken;
  
  // Commitment data
  let commitment;
  let nullifier;
  let nullifierHash;
  let secret;
  
  // Proofs
  let proof;
  let root;
  let metadataProof;
  let metadataHash;
  
  /**
   * Generate a commitment for depositing into Tornado
   */
  function generateCommitmentData() {
    // Generate random nullifier and secret
    nullifier = '0x' + crypto.randomBytes(31).toString('hex');
    secret = '0x' + crypto.randomBytes(31).toString('hex');
    
    // Hash the nullifier and secret to create commitment
    commitment = web3.utils.soliditySha3(
      { type: 'bytes32', value: nullifier },
      { type: 'bytes32', value: secret }
    );
    
    // Hash the nullifier to get nullifier hash
    nullifierHash = web3.utils.soliditySha3(
      { type: 'bytes32', value: nullifier }
    );
    
    return { commitment, nullifier, nullifierHash, secret };
  }
  
  /**
   * Generate a mock proof for Tornado withdrawal
   */
  async function generateTornadoProof() {
    // Get the current root from the tornado instance
    root = await tornadoInstance.getLastRoot();
    
    // Mock proof data - in a real scenario this would be an actual ZK proof
    proof = '0x00';
    
    return { proof, root };
  }
  
  /**
   * Generate a mock metadata proof
   */
  function generateMetadataProof() {
    // Hash the token metadata
    metadataHash = web3.utils.soliditySha3(
      { type: 'string', value: tokenName },
      { type: 'uint256', value: tokenSupply.toString() },
      { type: 'string', value: tokenDescription },
      { type: 'uint256', value: taxRate.toString() }
    );
    
    // Mock metadata proof
    metadataProof = '0x00';
    
    return { metadataProof, metadataHash };
  }
  
  /**
   * Create TokenData struct
   */
  function createTokenData() {
    return {
      name: tokenName,
      symbol: tokenSymbol,
      initialSupply: tokenSupply,
      description: tokenDescription,
      taxRate: taxRate,
      taxRecipient: taxRecipient,
      burnEnabled: burnEnabled,
      liquidityLockPeriod: liquidityLockPeriod
    };
  }
  
  /**
   * Create ProofData struct
   */
  function createProofData() {
    return {
      instanceIndex: instanceIndex,
      proof: proof,
      root: root,
      nullifierHash: nullifierHash,
      recipient: recipient,
      relayer: relayer,
      fee: fee,
      refund: refund,
      metadataProof: metadataProof,
      metadataHash: metadataHash
    };
  }
  
  before(async function() {
    // Deploy all the necessary contracts
    console.log("Setting up test environment...");
    
    // 1. Deploy TokenTemplate
    tokenTemplate = await TokenTemplate.new();
    console.log(`TokenTemplate deployed at: ${tokenTemplate.address}`);
    
    // 2. Deploy MetadataVerifier
    metadataVerifier = await MetadataVerifier.new();
    console.log(`MetadataVerifier deployed at: ${metadataVerifier.address}`);
    
    // 3. Deploy Hasher and Verifier for Tornado
    const hasher = await Hasher.new();
    const verifier = await Verifier.new();
    console.log(`Hasher deployed at: ${hasher.address}`);
    console.log(`Verifier deployed at: ${verifier.address}`);
    
    // 4. Deploy the ETH Tornado instance (0.1 ETH)
    const merkleTreeHeight = 20;
    tornadoInstance = await ETHTornado.new(
      verifier.address,
      hasher.address,
      web3.utils.toWei('0.1'),
      merkleTreeHeight
    );
    console.log(`Tornado instance deployed at: ${tornadoInstance.address}`);
    
    // 5. Deploy UniswapHandler with router address
    const mockUniswapRouter = accounts[7]; // Mock router address
    uniswapHandler = await UniswapHandler.new(mockUniswapRouter);
    console.log(`UniswapHandler deployed at: ${uniswapHandler.address}`);
    
    // 6. Deploy GhostPad
    ghostPad = await GhostPad.new(
      tokenTemplate.address,
      governance,
      metadataVerifier.address,
      [tornadoInstance.address],
      uniswapHandler.address
    );
    console.log(`GhostPad deployed at: ${ghostPad.address}`);
    
    // 7. Generate commitment data
    generateCommitmentData();
    console.log(`Generated commitment: ${commitment}`);
    console.log(`Generated nullifier hash: ${nullifierHash}`);
    
    // 8. Generate proofs
    generateMetadataProof();
  });
  
  describe('Complete GhostPad Usage Flow', function() {
    it('Step 1: Should deposit ETH to Tornado instance', async function() {
      console.log("Making deposit to Tornado instance...");
      
      const tx = await tornadoInstance.deposit(commitment, { 
        from: deployer,
        value: web3.utils.toWei('0.1'),
        gas: 1000000
      });
      
      expectEvent(tx, 'Deposit', { commitment: commitment });
      console.log("Deposit successful!");
    });
    
    it('Step 2: Should wait for privacy window (simulated)', async function() {
      console.log("Waiting for privacy window...");
      
      // Simulate waiting for privacy by increasing blockchain time
      await time.increase(time.duration.hours(1));
      
      console.log("Privacy window passed!");
    });
    
    it('Step 3: Should generate proofs', async function() {
      console.log("Generating proofs...");
      
      // Generate Tornado withdrawal proof
      const tornadoProof = await generateTornadoProof();
      proof = tornadoProof.proof;
      root = tornadoProof.root;
      
      expect(proof).to.equal('0x00'); // Mock proof validation
      expect(root).to.not.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
      
      console.log("Proofs generated successfully!");
    });
    
    it('Step 4: Should deploy a token through GhostPad', async function() {
      console.log("Deploying token through GhostPad...");
      
      // Create structured parameters
      const tokenData = createTokenData();
      const proofData = createProofData();
      
      // Deploy token with new parameter structure
      const deployTx = await ghostPad.deployToken(
        tokenData,
        proofData,
        true, // useProtocolFee
        false, // vestingEnabled
        {
          from: deployer,
          value: refund,
          gas: 5000000
        }
      );
      
      expectEvent(deployTx, 'TokenDeployed', {
        nullifierHash: nullifierHash,
        name: tokenName,
        symbol: tokenSymbol
      });
      
      // Get the deployed token address
      const tokenAddress = await ghostPad.getDeployedToken(nullifierHash);
      expect(tokenAddress).to.not.equal('0x0000000000000000000000000000000000000000');
      
      // Save token address for further tests
      deployedToken = await TokenTemplate.at(tokenAddress);
      console.log(`Token deployed at address: ${tokenAddress}`);
    });
    
    it('Step 5: Should deploy a token with liquidity through GhostPad', async function() {
      console.log("Generating new commitment for token with liquidity...");
      
      // Generate new commitment to avoid nullifier reuse
      const newCommitmentData = generateCommitmentData();
      const tornadoProof = await generateTornadoProof();
      proof = tornadoProof.proof;
      root = tornadoProof.root;
      
      generateMetadataProof();
      
      // Create structured parameters
      const tokenData = createTokenData();
      tokenData.name = "Liquidity Token";
      tokenData.symbol = "LIQD";
      
      const proofData = createProofData();
      
      // Set up liquidity parameters
      const liquidityTokenAmount = web3.utils.toWei('100000');
      const liquidityEthAmount = web3.utils.toWei('10');
      
      console.log("Deploying token with liquidity...");
      
      // Deploy token with liquidity
      const deployLiquidityTx = await ghostPad.deployTokenWithLiquidity(
        tokenData,
        proofData,
        liquidityTokenAmount,
        liquidityEthAmount,
        true, // useProtocolFee
        false, // vestingEnabled
        {
          from: deployer,
          value: web3.utils.toBN(liquidityEthAmount).add(web3.utils.toBN(refund)),
          gas: 5000000
        }
      );
      
      expectEvent(deployLiquidityTx, 'TokenDeployed', {
        nullifierHash: nullifierHash,
        name: "Liquidity Token",
        symbol: "LIQD"
      });
      
      // Also should have emitted LiquidityPoolCreated
      expectEvent(deployLiquidityTx, 'LiquidityPoolCreated');
      
      console.log("Token with liquidity deployed successfully");
    });
    
    it('Step 6: Should verify token properties', async function() {
      console.log("Verifying token properties...");
      
      // Basic token properties
      expect(await deployedToken.name()).to.equal(tokenName);
      expect(await deployedToken.symbol()).to.equal(tokenSymbol);
      expect(await deployedToken.description()).to.equal(tokenDescription);
      
      // Custom properties specific to GhostPad tokens
      expect(await deployedToken.taxRate()).to.be.bignumber.equal(new BN(taxRate));
      expect(await deployedToken.taxRecipient()).to.equal(taxRecipient);
      expect(await deployedToken.burnEnabled()).to.be.true;
      
      console.log("Token properties verified!");
    });
    
    it('Step 7: Should verify token balances after deployment', async function() {
      console.log("Verifying initial token balances...");
      
      // 97% of supply should go to recipient, 3% to governance
      const expectedRecipientBalance = new BN(tokenSupply).mul(new BN(97)).div(new BN(100));
      const expectedGovernanceBalance = new BN(tokenSupply).mul(new BN(3)).div(new BN(100));
      
      const actualRecipientBalance = await deployedToken.balanceOf(recipient);
      const actualGovernanceBalance = await deployedToken.balanceOf(governance);
      
      expect(actualRecipientBalance).to.be.bignumber.equal(expectedRecipientBalance);
      expect(actualGovernanceBalance).to.be.bignumber.equal(expectedGovernanceBalance);
      
      console.log(`Recipient balance: ${web3.utils.fromWei(actualRecipientBalance)} ${tokenSymbol}`);
      console.log(`Governance balance: ${web3.utils.fromWei(actualGovernanceBalance)} ${tokenSymbol}`);
    });
    
    it('Step 8: Should apply tax when transferring tokens', async function() {
      console.log("Testing token transfer with tax...");
      
      // Transfer 10,000 tokens to user1
      const transferAmount = web3.utils.toWei('10000');
      
      // Calculate expected tax
      const expectedTaxAmount = new BN(transferAmount).mul(new BN(taxRate)).div(new BN(10000));
      const expectedReceivedAmount = new BN(transferAmount).sub(expectedTaxAmount);
      
      // Get initial balances
      const initialRecipientBalance = await deployedToken.balanceOf(recipient);
      const initialTaxRecipientBalance = await deployedToken.balanceOf(taxRecipient);
      
      // Perform transfer
      await deployedToken.transfer(user1, transferAmount, { from: recipient });
      
      // Verify balances after transfer
      const finalRecipientBalance = await deployedToken.balanceOf(recipient);
      const user1Balance = await deployedToken.balanceOf(user1);
      const finalTaxRecipientBalance = await deployedToken.balanceOf(taxRecipient);
      
      // Recipient should have sent the full amount
      expect(finalRecipientBalance).to.be.bignumber.equal(
        initialRecipientBalance.sub(new BN(transferAmount))
      );
      
      // User1 should have received amount minus tax
      expect(user1Balance).to.be.bignumber.equal(expectedReceivedAmount);
      
      // Tax recipient should have received the tax amount
      const taxRecipientDifference = finalTaxRecipientBalance.sub(initialTaxRecipientBalance);
      expect(taxRecipientDifference).to.be.bignumber.equal(expectedTaxAmount);
      
      console.log(`Transfer amount: ${web3.utils.fromWei(transferAmount)} ${tokenSymbol}`);
      console.log(`Tax amount: ${web3.utils.fromWei(expectedTaxAmount)} ${tokenSymbol}`);
      console.log(`User1 received: ${web3.utils.fromWei(user1Balance)} ${tokenSymbol}`);
    });
    
    it('Step 9: Should allow burning tokens when enabled', async function() {
      console.log("Testing token burning functionality...");
      
      // Token burn amount
      const burnAmount = web3.utils.toWei('1000');
      
      // Get initial balances
      const initialUser1Balance = await deployedToken.balanceOf(user1);
      const initialTotalSupply = await deployedToken.totalSupply();
      
      // Burn tokens
      await deployedToken.burn(burnAmount, { from: user1 });
      
      // Verify balances after burn
      const finalUser1Balance = await deployedToken.balanceOf(user1);
      const finalTotalSupply = await deployedToken.totalSupply();
      
      // User1 balance should be reduced
      expect(finalUser1Balance).to.be.bignumber.equal(
        initialUser1Balance.sub(new BN(burnAmount))
      );
      
      // Total supply should be reduced
      expect(finalTotalSupply).to.be.bignumber.equal(
        initialTotalSupply.sub(new BN(burnAmount))
      );
      
      console.log(`Burned amount: ${web3.utils.fromWei(burnAmount)} ${tokenSymbol}`);
      console.log(`New total supply: ${web3.utils.fromWei(finalTotalSupply)} ${tokenSymbol}`);
    });
    
    it('Step 10: Should allow token owner to update tax configuration', async function() {
      console.log("Testing token owner configuration updates...");
      
      // Update tax rate to 2%
      const newTaxRate = 200;
      await deployedToken.updateTaxRate(newTaxRate, { from: recipient });
      expect(await deployedToken.taxRate()).to.be.bignumber.equal(new BN(newTaxRate));
      
      // Update tax recipient to user2
      await deployedToken.updateTaxRecipient(user2, { from: recipient });
      expect(await deployedToken.taxRecipient()).to.equal(user2);
      
      // Test transfer with new tax settings
      const transferAmount = web3.utils.toWei('5000');
      const expectedTaxAmount = new BN(transferAmount).mul(new BN(newTaxRate)).div(new BN(10000));
      
      // Transfer from user1 to relayer
      await deployedToken.transfer(relayer, transferAmount, { from: user1 });
      
      // Verify tax went to new recipient
      const user2Balance = await deployedToken.balanceOf(user2);
      expect(user2Balance).to.be.bignumber.equal(expectedTaxAmount);
      
      console.log(`Updated tax rate: ${newTaxRate / 100}%`);
      console.log(`New tax recipient: ${user2}`);
      console.log(`Tax received by new recipient: ${web3.utils.fromWei(user2Balance)} ${tokenSymbol}`);
    });
    
    it('Step 11: Should allow disabling and re-enabling burn functionality', async function() {
      console.log("Testing burn functionality toggling...");
      
      // Disable burning
      await deployedToken.setBurnEnabled(false, { from: recipient });
      expect(await deployedToken.burnEnabled()).to.be.false;
      
      // Try to burn tokens when disabled
      const burnAmount = web3.utils.toWei('100');
      await expectRevert(
        deployedToken.burn(burnAmount, { from: relayer }),
        "Burning is disabled for this token"
      );
      
      // Re-enable burning
      await deployedToken.setBurnEnabled(true, { from: recipient });
      expect(await deployedToken.burnEnabled()).to.be.true;
      
      // Burn tokens when enabled
      await deployedToken.burn(burnAmount, { from: relayer });
      
      console.log("Burn functionality toggle tested successfully!");
    });
  });
}); 