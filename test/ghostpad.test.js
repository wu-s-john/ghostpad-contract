const TokenTemplate = artifacts.require("TokenTemplate");
const MetadataVerifier = artifacts.require("MetadataVerifier");
const GhostPad = artifacts.require("GhostPad");
const ETHTornado = artifacts.require("ETHTornado");
const Verifier = artifacts.require("Verifier");
const Hasher = artifacts.require("Hasher");
const ERC20 = artifacts.require("ERC20");
const UniswapHandler = artifacts.require("UniswapHandler");

const { BN, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const crypto = require('crypto');

contract('GhostPad', function (accounts) {
  const deployer = accounts[0];
  const governance = accounts[1];
  const depositor = accounts[2];
  const recipient = accounts[3];
  const relayer = accounts[4];
  
  // Mock values for deposit
  let commitment;
  let nullifier;
  let nullifierHash;
  let secret;
  
  // Mock values for token
  const tokenName = "GhostCoin";
  const tokenSymbol = "GHOST";
  const tokenSupply = new BN('1000000000000000000000000'); // 1M tokens
  const tokenDescription = "A privacy-focused memecoin for testing";
  const taxRate = 100; // 1% in basis points
  const taxRecipient = accounts[5];
  const burnEnabled = true;
  const liquidityLockPeriod = 60 * 60 * 24 * 30; // 30 days
  const liquidityTokenAmount = new BN('100000000000000000000000'); // 100k tokens
  const liquidityEthAmount = new BN(web3.utils.toWei('1', 'ether')); // 1 ETH
  const vestingDuration = 60 * 60 * 24 * 365; // 1 year
  
  // Tornado Cash parameters
  const deposit = new BN(web3.utils.toWei('0.1', 'ether'));
  const fee = new BN(0);
  const refund = new BN(0);
  
  // Mock tornado proof
  const proof = "0x00";
  
  // Mock metadata
  const metadataHash = "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba";
  
  // Contract instances
  let tokenTemplate;
  let metadataVerifier;
  let ethTornado01;
  let ethTornado1;
  let ethTornado10;
  let ethTornado100;
  let ghostPad;
  let deployedToken;
  let tornadoInstance;
  let uniswapHandler;
  
  // Helper function to generate commitment data
  function generateCommitmentData() {
    // In a real scenario, this would use secure random generation
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
  
  // Helper function to mock a proof (would be a real ZK proof in production)
  async function generateMockProof(instance) {
    // Get the current root from the tornado instance
    const root = await instance.getLastRoot();
    
    // Mock proof data - in a real scenario this would be an actual ZK proof
    // This is just a placeholder for testing
    const mockProof = '0x00';
    
    return { proof: mockProof, root };
  }
  
  // Helper function to generate a mock metadata proof
  async function generateMockMetadataProof(name, supply, description, taxRate) {
    // Normally this would be a real ZK proof
    const mockProof = "0x01";
    return mockProof;
  }
  
  // Helper function to mock tornado instance verification
  async function mockTornadoWithdraw() {
    // Mock the tornado instance for testing
    tornadoInstance = await ETHTornado.new(
      Verifier.address,
      Hasher.address,
      deposit,
      10,
      { from: accounts[0] }
    );
    
    // Implement a mock withdraw function that doesn't actually verify the proof
    await tornadoInstance.setVerifierToMock();
  }

  before(async function () {
    // This setup mirrors the deployment script
    // 1. Deploy TokenTemplate
    tokenTemplate = await TokenTemplate.new();
    
    // 2. Deploy MetadataVerifier (mock implementation for testing)
    metadataVerifier = await MetadataVerifier.new();
    
    // 3. Deploy Hasher and Verifier for Tornado
    const hasher = await Hasher.new();
    const verifier = await Verifier.new();
    
    // 4. Deploy the ETH Tornado instances
    const merkleTreeHeight = 20;
    
    ethTornado01 = await ETHTornado.new(
      verifier.address,
      hasher.address,
      web3.utils.toWei('0.1'),
      merkleTreeHeight
    );
    
    ethTornado1 = await ETHTornado.new(
      verifier.address,
      hasher.address,
      web3.utils.toWei('1'),
      merkleTreeHeight
    );
    
    ethTornado10 = await ETHTornado.new(
      verifier.address,
      hasher.address,
      web3.utils.toWei('10'),
      merkleTreeHeight
    );
    
    ethTornado100 = await ETHTornado.new(
      verifier.address,
      hasher.address,
      web3.utils.toWei('100'),
      merkleTreeHeight
    );
    
    // 5. Deploy GhostPad with the Tornado instances
    ghostPad = await GhostPad.new(
      tokenTemplate.address,
      governance,
      metadataVerifier.address,
      [
        ethTornado01.address,
        ethTornado1.address,
        ethTornado10.address,
        ethTornado100.address
      ]
    );
    
    // Generate commitment data for tests
    generateCommitmentData();
    
    // Set up a mock tornado instance
    await mockTornadoWithdraw();
    
    // Deploy Uniswap handler with a mock factory and router
    uniswapHandler = await UniswapHandler.new(accounts[7], accounts[8], { from: accounts[0] });
    
    // Set up MetadataVerifier to mock proof verification
    await metadataVerifier.setMockMode(true);
  });
  
  describe('Initialization', function () {
    it('should initialize GhostPad with correct values', async function () {
      expect(await ghostPad.tokenTemplate()).to.equal(tokenTemplate.address);
      expect(await ghostPad.governance()).to.equal(governance);
      expect(await ghostPad.metadataVerifier()).to.equal(metadataVerifier.address);
      const instanceCount = await ghostPad.instanceCount();
      expect(instanceCount).to.be.bignumber.equal(new BN(4));
      
      // Check first tornado instance details
      const instance0 = await ghostPad.getTornadoInstance(0);
      expect(instance0.instance).to.equal(ethTornado01.address);
      expect(instance0.denomination).to.be.bignumber.equal(web3.utils.toWei('0.1'));
    });
  });
  
  describe('Deposit and Token Deployment Flow', function () {
    it('should deposit to Tornado instance', async function () {
      // Use the smallest denomination (0.1 ETH) for testing
      const deposit = await ethTornado01.deposit(commitment, { 
        from: depositor,
        value: web3.utils.toWei('0.1')
      });
      
      expectEvent(deposit, 'Deposit', {
        commitment: commitment
      });
    });
    
    it('should deploy a token using deposit proof with custom properties', async function () {
      // In a real scenario, there would be a delay between deposit and withdrawal
      // to ensure anonymity
      await time.increase(time.duration.hours(1));
      
      // Generate proofs
      const { proof, root } = await generateMockProof(ethTornado01);
      const { metadataProof, metadataHash } = generateMockMetadataProof(
        tokenName, 
        tokenSupply,
        tokenDescription,
        taxRate
      );
      
      // Set up relayer fee and refund
      const fee = web3.utils.toWei('0.001');
      const refund = web3.utils.toWei('0');
      
      // Deploy token through GhostPad
      const deployTx = await ghostPad.deployToken(
        0, // Using the 0.1 ETH instance (index 0)
        proof,
        root,
        nullifierHash,
        recipient,
        relayer,
        fee,
        refund,
        tokenName,
        tokenSymbol,
        tokenSupply,
        metadataProof,
        metadataHash,
        tokenDescription,
        taxRate,
        taxRecipient,
        burnEnabled,
        liquidityLockPeriod,
        {
          from: deployer,
          value: refund, // Add any required refund value
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
    });
    
    it('should have correct token properties', async function () {
      expect(await deployedToken.name()).to.equal(tokenName);
      expect(await deployedToken.symbol()).to.equal(tokenSymbol);
      expect(await deployedToken.description()).to.equal(tokenDescription);
      expect(await deployedToken.taxRate()).to.be.bignumber.equal(new BN(taxRate));
      expect(await deployedToken.taxRecipient()).to.equal(taxRecipient);
      expect(await deployedToken.burnEnabled()).to.be.true;
      
      // 97% of supply should go to recipient, 3% to governance
      const expectedRecipientBalance = new BN(tokenSupply).mul(new BN(97)).div(new BN(100));
      const expectedGovernanceBalance = new BN(tokenSupply).mul(new BN(3)).div(new BN(100));
      
      expect(await deployedToken.balanceOf(recipient)).to.be.bignumber.equal(expectedRecipientBalance);
      expect(await deployedToken.balanceOf(governance)).to.be.bignumber.equal(expectedGovernanceBalance);
    });
    
    it('should not allow reusing the same nullifier hash', async function () {
      // Generate new metadata proof but try to use the same nullifier hash
      const { metadataProof, metadataHash } = generateMockMetadataProof(
        "NewToken",
        tokenSupply,
        "A new description",
        200 // 2% tax
      );
      const { proof, root } = await generateMockProof(ethTornado01);
      
      // Attempt to deploy another token with the same nullifier hash
      await expectRevert(
        ghostPad.deployToken(
          0,
          proof,
          root,
          nullifierHash, // Reusing the same nullifier hash
          recipient,
          relayer,
          web3.utils.toWei('0.001'),
          web3.utils.toWei('0'),
          "NewToken",
          "NEW",
          tokenSupply,
          metadataProof,
          metadataHash,
          "A new description",
          200,
          taxRecipient,
          false,
          { from: deployer, gas: 5000000 }
        ),
        "Nullifier hash already used in GhostPad"
      );
    });
  });
  
  describe('Token transfers with tax', function () {
    it('should apply tax on transfers', async function () {
      // Get initial balances
      const senderInitialBalance = await deployedToken.balanceOf(recipient);
      const taxRecipientInitialBalance = await deployedToken.balanceOf(taxRecipient);
      
      // Transfer amount is 10,000 tokens
      const transferAmount = web3.utils.toWei('10000');
      const user = accounts[6];
      
      // Calculate expected tax amount (1% of transfer amount)
      const expectedTaxAmount = new BN(transferAmount).mul(new BN(taxRate)).div(new BN(10000));
      const expectedReceivedAmount = new BN(transferAmount).sub(expectedTaxAmount);
      
      // Perform the transfer
      await deployedToken.transfer(user, transferAmount, { from: recipient });
      
      // Check balances after transfer
      const senderFinalBalance = await deployedToken.balanceOf(recipient);
      const receiverBalance = await deployedToken.balanceOf(user);
      const taxRecipientFinalBalance = await deployedToken.balanceOf(taxRecipient);
      
      // Sender should have lost the full transfer amount
      expect(senderFinalBalance).to.be.bignumber.equal(
        senderInitialBalance.sub(new BN(transferAmount))
      );
      
      // Receiver should have received the transfer amount minus tax
      expect(receiverBalance).to.be.bignumber.equal(expectedReceivedAmount);
      
      // Tax recipient should have received the tax amount
      expect(taxRecipientFinalBalance).to.be.bignumber.equal(
        taxRecipientInitialBalance.add(expectedTaxAmount)
      );
    });
    
    it('should allow tokens to be burned when burn is enabled', async function () {
      const user = accounts[6];
      const initialBalance = await deployedToken.balanceOf(user);
      const initialTotalSupply = await deployedToken.totalSupply();
      
      // Burn 1,000 tokens
      const burnAmount = web3.utils.toWei('1000');
      await deployedToken.burn(burnAmount, { from: user });
      
      // Check balances after burn
      const finalBalance = await deployedToken.balanceOf(user);
      const finalTotalSupply = await deployedToken.totalSupply();
      
      expect(finalBalance).to.be.bignumber.equal(
        initialBalance.sub(new BN(burnAmount))
      );
      
      expect(finalTotalSupply).to.be.bignumber.equal(
        initialTotalSupply.sub(new BN(burnAmount))
      );
    });
  });
  
  describe('Token owner functions', function () {
    it('should allow owner to update description', async function () {
      const newDescription = "Updated description for testing";
      await deployedToken.updateDescription(newDescription, { from: recipient });
      expect(await deployedToken.description()).to.equal(newDescription);
    });
    
    it('should allow owner to update tax rate', async function () {
      const newTaxRate = 200; // 2% in basis points
      await deployedToken.updateTaxRate(newTaxRate, { from: recipient });
      expect(await deployedToken.taxRate()).to.be.bignumber.equal(new BN(newTaxRate));
    });
    
    it('should allow owner to update tax recipient', async function () {
      const newTaxRecipient = accounts[7];
      await deployedToken.updateTaxRecipient(newTaxRecipient, { from: recipient });
      expect(await deployedToken.taxRecipient()).to.equal(newTaxRecipient);
    });
    
    it('should allow owner to disable burning', async function () {
      await deployedToken.setBurnEnabled(false, { from: recipient });
      expect(await deployedToken.burnEnabled()).to.be.false;
      
      // Try to burn tokens when burning is disabled
      const burnAmount = web3.utils.toWei('100');
      await expectRevert(
        deployedToken.burn(burnAmount, { from: accounts[6] }),
        "Burning is disabled for this token"
      );
    });
  });
  
  describe('Multiple instance testing', function () {
    it('should deposit to different denomination instance', async function () {
      // Generate new commitment for a new deposit
      const { commitment: newCommitment } = generateCommitmentData();
      
      // Deposit to the 1 ETH instance
      const deposit = await ethTornado1.deposit(newCommitment, { 
        from: depositor,
        value: web3.utils.toWei('1')
      });
      
      expectEvent(deposit, 'Deposit', {
        commitment: newCommitment
      });
    });
  });
  
  describe('Token deployment flow', function () {
    let tokenAddress;
    
    it('should deploy a token successfully', async function () {
      // Create struct parameters
      const tokenData = createTokenData();
      const proofData = createProofData();
      
      // Deploy token with struct parameters
      const tx = await ghostPad.deployToken(
        tokenData,
        proofData,
        true, // useProtocolFee
        false, // vestingEnabled
        { from: deployer, gas: 5000000 }
      );
      
      // Verify events and token address
      expectEvent(tx, 'TokenDeployed', { 
        nullifierHash: nullifierHash,
        name: tokenName,
        symbol: tokenSymbol
      });
      
      const tokenAddress = await ghostPad.getDeployedToken(nullifierHash);
      expect(tokenAddress).to.not.equal(constants.ZERO_ADDRESS);
      
      // Verify token was initialized correctly
      const token = await TokenTemplate.at(tokenAddress);
      expect(await token.name()).to.equal(tokenName);
      expect(await token.symbol()).to.equal(tokenSymbol);
      expect(await token.description()).to.equal(tokenDescription);
    });
    
    it('should deploy a token with liquidity successfully', async function () {
      // Generate new nullifier hash to avoid reuse
      nullifier = '0x' + crypto.randomBytes(31).toString('hex');
      nullifierHash = web3.utils.soliditySha3({ type: 'bytes32', value: nullifier });
      
      // Mock new tornado proof with the new nullifier
      await mockTornadoWithdraw();
      
      // Create struct parameters
      const tokenData = createTokenData();
      tokenData.name = "Liquidity Token";
      tokenData.symbol = "LIQD";
      
      const proofData = createProofData();
      
      // Deploy token with liquidity
      const tx = await ghostPad.deployTokenWithLiquidity(
        tokenData,
        proofData,
        liquidityTokenAmount,
        liquidityEthAmount,
        true, // useProtocolFee
        false, // vestingEnabled
        { 
          from: deployer, 
          value: liquidityEthAmount.add(refund), 
          gas: 6000000 
        }
      );
      
      // Verify events
      expectEvent(tx, 'TokenDeployed', {
        nullifierHash: nullifierHash,
        name: "Liquidity Token",
        symbol: "LIQD"
      });
      
      // Should also emit LiquidityPoolCreated
      expectEvent(tx, 'LiquidityPoolCreated');
      
      // Get the token address and verify it was created
      const tokenAddress = await ghostPad.getDeployedToken(nullifierHash);
      expect(tokenAddress).to.not.equal(constants.ZERO_ADDRESS);
    });
    
    it('should not allow reusing the same nullifier hash', async function () {
      // Try to deploy another token with the same nullifier hash
      const tokenData = createTokenData();
      const proofData = createProofData();
      
      // This should fail because nullifierHash is already used
      await expectRevert(
        ghostPad.deployToken(
          tokenData,
          proofData,
          true, // useProtocolFee
          false, // vestingEnabled
          { from: deployer, gas: 5000000 }
        ),
        "Nullifier hash already used in GhostPad"
      );
    });
  });
  
  describe('Vesting schedule functionality', function () {
    let tokenAddress;
    let token;
    const vestingAmount = new BN('100000000000000000000000'); // 100k tokens
    const vestingBeneficiary = accounts[6];
    
    before(async function() {
      // Deploy a token first
      const newNullifierHash = "0x3234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const metadataProof = await generateMockMetadataProof(tokenName, tokenSupply, tokenDescription, taxRate);
      
      const tx = await ghostPad.deployToken(
        0, // instanceIndex
        proof,
        root,
        newNullifierHash,
        recipient,
        relayer,
        fee,
        refund,
        tokenName,
        tokenSymbol,
        tokenSupply,
        metadataProof,
        metadataHash,
        tokenDescription,
        taxRate,
        taxRecipient,
        burnEnabled,
        liquidityLockPeriod,
        { from: deployer, value: deposit }
      );
      
      tokenAddress = tx.logs[0].args.tokenAddress;
      token = await TokenTemplate.at(tokenAddress);
    });
    
    it('should create a vesting schedule', async function () {
      const now = await time.latest();
      const startTime = now;
      const cliff = 60 * 60 * 24 * 30; // 30 days cliff
      const revocable = true;
      
      // Approve token to be taken by owner for vesting
      await token.approve(recipient, vestingAmount, { from: recipient });
      
      // Create vesting schedule
      await token.createVestingSchedule(
        vestingBeneficiary,
        startTime,
        cliff,
        vestingDuration,
        revocable,
        vestingAmount,
        { from: recipient }
      );
      
      // Verify vesting schedule was created correctly
      const vestingScheduleId = await token.computeVestingScheduleIdForAddressAndIndex(vestingBeneficiary, 0);
      const schedule = await token.getVestingSchedule(vestingScheduleId);
      
      expect(schedule.beneficiary).to.equal(vestingBeneficiary, 'Beneficiary mismatch');
      expect(schedule.cliff.toString()).to.equal(cliff.toString(), 'Cliff mismatch');
      expect(schedule.duration.toString()).to.equal(vestingDuration.toString(), 'Duration mismatch');
      expect(schedule.revocable).to.be.true;
      expect(schedule.amountTotal.toString()).to.equal(vestingAmount.toString(), 'Total amount mismatch');
      expect(schedule.released.toString()).to.equal('0', 'Released amount should be zero');
      expect(schedule.revoked).to.be.false;
      
      // Check token balances
      const lockedAmount = await token.getVestingSchedulesTotalAmount();
      expect(lockedAmount.toString()).to.equal(vestingAmount.toString(), 'Locked amount mismatch');
    });
    
    it('should not allow releasing tokens before cliff', async function () {
      const vestingScheduleId = await token.computeVestingScheduleIdForAddressAndIndex(vestingBeneficiary, 0);
      
      try {
        await token.release(vestingScheduleId, vestingAmount, { from: vestingBeneficiary });
        expect.fail('Should not allow releasing tokens before cliff');
      } catch (error) {
        expect(error.message).to.include('TokenVesting: no tokens are due', 'Expected error message not found');
      }
    });
    
    it('should release tokens after cliff', async function () {
      // Fast forward time past the cliff
      const cliffDuration = 60 * 60 * 24 * 31; // 31 days
      await time.increase(cliffDuration);
      
      const vestingScheduleId = await token.computeVestingScheduleIdForAddressAndIndex(vestingBeneficiary, 0);
      
      // Calculate releasable amount
      const releasableAmount = await token.computeReleasableAmount(vestingScheduleId);
      expect(parseInt(releasableAmount.toString())).to.be.above(0, 'Should have releasable tokens after cliff');
      
      // Release half of the releasable amount
      const releaseAmount = releasableAmount.div(new BN('2'));
      await token.release(vestingScheduleId, releaseAmount, { from: vestingBeneficiary });
      
      // Check beneficiary balance
      const beneficiaryBalance = await token.balanceOf(vestingBeneficiary);
      expect(beneficiaryBalance.toString()).to.equal(releaseAmount.toString(), 'Beneficiary balance mismatch');
      
      // Check updated vesting schedule
      const schedule = await token.getVestingSchedule(vestingScheduleId);
      expect(schedule.released.toString()).to.equal(releaseAmount.toString(), 'Released amount mismatch');
    });
    
    it('should allow owner to revoke vesting schedule', async function () {
      const vestingScheduleId = await token.computeVestingScheduleIdForAddressAndIndex(vestingBeneficiary, 0);
      
      // Get schedule before revocation
      const scheduleBefore = await token.getVestingSchedule(vestingScheduleId);
      const releasedBefore = scheduleBefore.released;
      const totalAmount = scheduleBefore.amountTotal;
      const unreleased = totalAmount.sub(releasedBefore);
      
      // Check owner balance before revocation
      const ownerBalanceBefore = await token.balanceOf(recipient);
      
      // Revoke the vesting schedule
      await token.revoke(vestingScheduleId, { from: recipient });
      
      // Check that schedule is revoked
      const scheduleAfter = await token.getVestingSchedule(vestingScheduleId);
      expect(scheduleAfter.revoked).to.be.true;
      
      // Check owner balance after revocation (should get unreleased tokens back)
      const ownerBalanceAfter = await token.balanceOf(recipient);
      expect(
        ownerBalanceAfter.toString()
      ).to.equal(
        ownerBalanceBefore.add(unreleased).toString(),
        'Owner should receive unreleased tokens'
      );
    });
  });
  
  describe('Locked liquidity functionality', function () {
    let tokenAddress;
    let token;
    
    before(async function() {
      // Deploy a token with liquidity
      const newNullifierHash = "0x4234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const metadataProof = await generateMockMetadataProof(tokenName, tokenSupply, tokenDescription, taxRate);
      
      // Set up mock Uniswap handler behavior
      await uniswapHandler.setMockAddLiquidityResult(true);
      
      const totalValue = liquidityEthAmount.add(deposit);
      
      const tx = await ghostPad.deployTokenWithLiquidity(
        0, // instanceIndex
        proof,
        root,
        newNullifierHash,
        recipient,
        relayer,
        fee,
        refund,
        tokenName,
        tokenSymbol,
        tokenSupply,
        metadataProof,
        metadataHash,
        tokenDescription,
        taxRate,
        taxRecipient,
        burnEnabled,
        liquidityLockPeriod,
        liquidityTokenAmount,
        liquidityEthAmount,
        { from: deployer, value: totalValue }
      );
      
      tokenAddress = tx.logs.find(log => log.event === 'TokenDeployed').args.tokenAddress;
      token = await TokenTemplate.at(tokenAddress);
    });
    
    it('should have locked liquidity', async function () {
      // Verify liquidity is locked in the mock
      const isLiquidityLocked = await uniswapHandler.isMockLiquidityLocked(tokenAddress);
      expect(isLiquidityLocked).to.be.true;
      
      // Verify lock period
      const liquidityInfo = await uniswapHandler.getLiquidityInfo(tokenAddress);
      expect(liquidityInfo.isLocked).to.be.true;
    });
    
    it('should not allow transferring LP tokens while locked', async function () {
      try {
        await uniswapHandler.transferLPTokens(tokenAddress, { from: recipient });
        expect.fail('Should not allow transferring LP tokens while locked');
      } catch (error) {
        expect(error.message).to.include('Liquidity is still locked', 'Expected error message not found');
      }
    });
    
    it('should allow transferring LP tokens after lock period', async function () {
      // Fast forward time past the lock period
      await time.increase(liquidityLockPeriod + 100);
      
      // Set mock to simulate unlock
      await uniswapHandler.setMockLiquidityLocked(tokenAddress, false);
      
      // Should now be able to transfer LP tokens
      await uniswapHandler.transferLPTokens(tokenAddress, { from: recipient });
      
      // Verify LP tokens were transferred in the mock
      const transferSucceeded = await uniswapHandler.mockLPTokensTransferred(tokenAddress);
      expect(transferSucceeded).to.be.true;
    });
  });
  
  describe('Contract locking functionality', function () {
    let tokenAddress;
    let token;
    
    before(async function() {
      // Deploy a token
      const newNullifierHash = "0x5234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const metadataProof = await generateMockMetadataProof(tokenName, tokenSupply, tokenDescription, taxRate);
      
      const tx = await ghostPad.deployToken(
        0, // instanceIndex
        proof,
        root,
        newNullifierHash,
        recipient,
        relayer,
        fee,
        refund,
        tokenName,
        tokenSymbol,
        tokenSupply,
        metadataProof,
        metadataHash,
        tokenDescription,
        taxRate,
        taxRecipient,
        burnEnabled,
        liquidityLockPeriod,
        { from: deployer, value: deposit }
      );
      
      tokenAddress = tx.logs[0].args.tokenAddress;
      token = await TokenTemplate.at(tokenAddress);
    });
    
    it('should allow modifying contract parameters before locking', async function () {
      // Update tax rate
      const newTaxRate = 200; // 2%
      await token.updateTaxRate(newTaxRate, { from: recipient });
      const taxRateAfter = await token.taxRate();
      expect(taxRateAfter.toString()).to.equal(newTaxRate.toString(), 'Tax rate not updated');
      
      // Update tax recipient
      const newTaxRecipient = accounts[7];
      await token.updateTaxRecipient(newTaxRecipient, { from: recipient });
      const taxRecipientAfter = await token.taxRecipient();
      expect(taxRecipientAfter).to.equal(newTaxRecipient, 'Tax recipient not updated');
      
      // Update description
      const newDescription = "Updated token description";
      await token.updateDescription(newDescription, { from: recipient });
      const descriptionAfter = await token.description();
      expect(descriptionAfter).to.equal(newDescription, 'Description not updated');
    });
    
    it('should lock the contract', async function () {
      // Lock the contract
      await token.lockContract({ from: recipient });
      
      // Verify contract is locked
      const isLocked = await token.contractLocked();
      expect(isLocked).to.be.true;
    });
    
    it('should not allow modifying contract parameters after locking', async function () {
      // Try to update tax rate
      try {
        await token.updateTaxRate(300, { from: recipient });
        expect.fail('Should not allow updating tax rate after locking');
      } catch (error) {
        expect(error.message).to.include('Contract is locked', 'Expected error message not found');
      }
      
      // Try to update tax recipient
      try {
        await token.updateTaxRecipient(accounts[8], { from: recipient });
        expect.fail('Should not allow updating tax recipient after locking');
      } catch (error) {
        expect(error.message).to.include('Contract is locked', 'Expected error message not found');
      }
      
      // Try to update description
      try {
        await token.updateDescription("New description", { from: recipient });
        expect.fail('Should not allow updating description after locking');
      } catch (error) {
        expect(error.message).to.include('Contract is locked', 'Expected error message not found');
      }
    });
  });
});

// Function to create TokenData struct for tests
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

// Function to create ProofData struct for tests
function createProofData() {
  return {
    instanceIndex: 0, // First tornado instance
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