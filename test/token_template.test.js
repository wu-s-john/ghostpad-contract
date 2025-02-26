const TokenTemplate = artifacts.require("TokenTemplate");
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('TokenTemplate', function (accounts) {
  const deployer = accounts[0];
  const owner = accounts[1];
  const user1 = accounts[2];
  const user2 = accounts[3];
  
  let tokenTemplate;
  
  // Token details
  const name = "Test Token";
  const symbol = "TEST";
  const initialSupply = web3.utils.toWei('1000000');
  const description = "A test token for the TokenTemplate contract";
  const taxRate = 100; // 1% in basis points
  const taxRecipient = owner; // Owner receives the tax
  const burnEnabled = true;
  const liquidityLockPeriod = 30 * 24 * 60 * 60; // 30 days
  const vestingEnabled = false;
  
  before(async function () {
    // Deploy the TokenTemplate contract
    tokenTemplate = await TokenTemplate.new({ from: deployer });
  });
  
  describe('Initialization', function () {
    it('should start with empty name and symbol', async function () {
      expect(await tokenTemplate.name()).to.equal('');
      expect(await tokenTemplate.symbol()).to.equal('');
    });
    
    it('should initialize correctly', async function () {
      await tokenTemplate.initialize(
        name, 
        symbol, 
        initialSupply, 
        owner, 
        description,
        taxRate,
        taxRecipient,
        burnEnabled,
        liquidityLockPeriod,
        vestingEnabled,
        { from: deployer }
      );
      
      expect(await tokenTemplate.name()).to.equal(name);
      expect(await tokenTemplate.symbol()).to.equal(symbol);
      expect(await tokenTemplate.totalSupply()).to.be.bignumber.equal(initialSupply);
      expect(await tokenTemplate.owner()).to.equal(owner);
      expect(await tokenTemplate.description()).to.equal(description);
      expect(await tokenTemplate.taxRate()).to.be.bignumber.equal(new BN(taxRate));
      expect(await tokenTemplate.taxRecipient()).to.equal(taxRecipient);
      expect(await tokenTemplate.burnEnabled()).to.be.true;
      
      // Deployer should have all tokens initially since the contract mints to msg.sender
      expect(await tokenTemplate.balanceOf(deployer)).to.be.bignumber.equal(initialSupply);
    });
    
    it('should prevent multiple initializations', async function () {
      await expectRevert(
        tokenTemplate.initialize(
          "Another Token", 
          "ATK", 
          initialSupply, 
          owner, 
          "Another description",
          taxRate,
          taxRecipient,
          burnEnabled,
          liquidityLockPeriod,
          vestingEnabled,
          { from: deployer }
        ),
        "Contract already initialized"
      );
    });
  });
  
  describe('Token functionality', function () {
    it('should allow transfers', async function () {
      const amount = web3.utils.toWei('1000');
      
      await tokenTemplate.transfer(user1, amount, { from: deployer });
      
      expect(await tokenTemplate.balanceOf(user1)).to.be.bignumber.equal(amount);
      expect(await tokenTemplate.balanceOf(deployer)).to.be.bignumber.equal(
        new BN(initialSupply).sub(new BN(amount))
      );
    });
    
    it('should allow owner to mint new tokens', async function () {
      const mintAmount = web3.utils.toWei('5000');
      const initialTotal = await tokenTemplate.totalSupply();
      
      await tokenTemplate.mint(user2, mintAmount, { from: owner });
      
      expect(await tokenTemplate.balanceOf(user2)).to.be.bignumber.equal(mintAmount);
      expect(await tokenTemplate.totalSupply()).to.be.bignumber.equal(
        initialTotal.add(new BN(mintAmount))
      );
    });
    
    it('should prevent non-owner from minting', async function () {
      const mintAmount = web3.utils.toWei('1000');
      
      await expectRevert(
        tokenTemplate.mint(user1, mintAmount, { from: user1 }),
        "Ownable: caller is not the owner"
      );
    });
    
    it('should allow users to burn their tokens when burning is enabled', async function () {
      const burnAmount = web3.utils.toWei('500');
      const initialBalance = await tokenTemplate.balanceOf(user1);
      const initialTotal = await tokenTemplate.totalSupply();
      
      await tokenTemplate.burn(burnAmount, { from: user1 });
      
      expect(await tokenTemplate.balanceOf(user1)).to.be.bignumber.equal(
        initialBalance.sub(new BN(burnAmount))
      );
      expect(await tokenTemplate.totalSupply()).to.be.bignumber.equal(
        initialTotal.sub(new BN(burnAmount))
      );
    });
    
    it('should apply tax when transferring tokens', async function() {
      const transferAmount = web3.utils.toWei('100');
      const expectedTaxAmount = new BN(transferAmount).mul(new BN(taxRate)).div(new BN(10000));
      const expectedReceivedAmount = new BN(transferAmount).sub(expectedTaxAmount);
      
      // Get initial balances
      const initialUser1Balance = await tokenTemplate.balanceOf(user1);
      const initialUser2Balance = await tokenTemplate.balanceOf(user2);
      const initialTaxRecipientBalance = await tokenTemplate.balanceOf(taxRecipient);
      
      // Perform transfer
      await tokenTemplate.transfer(user1, transferAmount, { from: user2 });
      
      // Verify balances after transfer
      const user1Balance = await tokenTemplate.balanceOf(user1);
      const user2Balance = await tokenTemplate.balanceOf(user2);
      const taxRecipientBalance = await tokenTemplate.balanceOf(taxRecipient);
      
      // User2 should have sent the full amount
      expect(user2Balance).to.be.bignumber.equal(
        initialUser2Balance.sub(new BN(transferAmount))
      );
      
      // User1 should have received amount minus tax
      expect(user1Balance).to.be.bignumber.equal(
        initialUser1Balance.add(expectedReceivedAmount)
      );
      
      // Tax recipient should have received the tax amount
      expect(taxRecipientBalance).to.be.bignumber.equal(
        initialTaxRecipientBalance.add(expectedTaxAmount)
      );
    });
  });
  
  describe('ERC20 functionality', function () {
    it('should have correct decimals', async function () {
      expect(await tokenTemplate.decimals()).to.be.bignumber.equal(new BN(18));
    });
    
    it('should handle allowances correctly', async function () {
      const approvalAmount = web3.utils.toWei('100');
      
      await tokenTemplate.approve(user2, approvalAmount, { from: user1 });
      
      expect(await tokenTemplate.allowance(user1, user2)).to.be.bignumber.equal(approvalAmount);
      
      const transferAmount = web3.utils.toWei('50');
      const initialSenderBalance = await tokenTemplate.balanceOf(user1);
      const initialReceiverBalance = await tokenTemplate.balanceOf(deployer);
      
      await tokenTemplate.transferFrom(user1, deployer, transferAmount, { from: user2 });
      
      expect(await tokenTemplate.balanceOf(user1)).to.be.bignumber.equal(
        initialSenderBalance.sub(new BN(transferAmount))
      );
      expect(await tokenTemplate.balanceOf(deployer)).to.be.bignumber.equal(
        initialReceiverBalance.add(new BN(transferAmount))
      );
      expect(await tokenTemplate.allowance(user1, user2)).to.be.bignumber.equal(
        new BN(approvalAmount).sub(new BN(transferAmount))
      );
    });
  });
}); 