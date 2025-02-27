import { expect, describe, it, beforeAll, beforeEach } from "vitest";
import { ethers } from "ethers";

// Import TypeChain factories and types
import { 
  TokenTemplate__factory
} from "../typechain";

import type {
  TokenTemplate
} from "../typechain";

describe('TokenTemplate', function () {
  // Account setup
  let accounts: string[];
  let deployer: string;
  let owner: string;
  let user1: string;
  let user2: string;
  
  // Contract instance
  let tokenTemplate: TokenTemplate;
  
  // Token details
  const name = "Test Token";
  const symbol = "TEST";
  const initialSupply = ethers.parseEther('1000000');
  const description = "A test token for the TokenTemplate contract";
  const taxRate = 100; // 1% in basis points
  let taxRecipient: string; // Owner receives the tax
  const burnEnabled = true;
  const liquidityLockPeriod = 30 * 24 * 60 * 60; // 30 days
  const vestingEnabled = false;
  
  beforeAll(async function () {
    // Get accounts from global signers
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    const signers = await Promise.all(Array(4).fill(0).map(async (_, i) => {
      const wallet = ethers.Wallet.createRandom().connect(provider);
      // Fund the wallet to perform transactions
      await provider.send("hardhat_setBalance", [
        await wallet.getAddress(),
        "0x1000000000000000000000000000000", // Large balance
      ]);
      return wallet;
    }));
    
    accounts = await Promise.all(signers.map(signer => signer.getAddress()));
    [deployer, owner, user1, user2] = accounts;
    taxRecipient = owner; // Set tax recipient to owner
    
    // Deploy the TokenTemplate contract using TypeChain factory
    const tokenTemplateFactory = new TokenTemplate__factory(signers[0]);
    tokenTemplate = await tokenTemplateFactory.deploy();
  });
  
  describe('Initialization', function () {
    it('should start with empty name and symbol', async function () {
      expect(await tokenTemplate.name()).toBe('');
      expect(await tokenTemplate.symbol()).toBe('');
    });
    
    it('should initialize correctly', async function () {
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      const deployerSigner = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, provider);
      
      // Initialize the token
      await tokenTemplate.initialize(
        owner,
        symbol, 
        initialSupply, 
        deployer, // Initial owner 
        description,
        taxRate,
        taxRecipient,
        burnEnabled,
        liquidityLockPeriod,
        vestingEnabled
      );
      
      // Check token properties
      expect(await tokenTemplate.symbol()).toBe(symbol);
      expect(await tokenTemplate.totalSupply()).toBe(initialSupply);
      expect(await tokenTemplate.owner()).toBe(owner);
      expect(await tokenTemplate.description()).toBe(description);
      expect(await tokenTemplate.taxRate()).toBe(BigInt(taxRate));
      expect(await tokenTemplate.taxRecipient()).toBe(taxRecipient);
      expect(await tokenTemplate.burnEnabled()).toBe(true);
      
      // Deployer should have all tokens initially
      expect(await tokenTemplate.balanceOf(deployer)).toBe(initialSupply);
    });
    
    it('should prevent multiple initializations', async function () {
      // Should revert when trying to initialize again
      await expect(
        tokenTemplate.initialize(
          owner,
          "ATK", 
          initialSupply, 
          deployer, 
          "Another description",
          taxRate,
          taxRecipient,
          burnEnabled,
          liquidityLockPeriod,
          vestingEnabled
        )
      ).rejects.toThrow("Contract already initialized");
    });
  });
  
  describe('Token functionality', function () {
    beforeEach(async function() {
      // Ensure tests have correct context by checking if token is initialized
      try {
        const symbol = await tokenTemplate.symbol();
        if (symbol !== symbol) {
          // If not initialized, initialize it
          await tokenTemplate.initialize(
            owner,
            symbol, 
            initialSupply, 
            deployer, 
            description,
            taxRate,
            taxRecipient,
            burnEnabled,
            liquidityLockPeriod,
            vestingEnabled
          );
        }
      } catch (error) {
        // Token is already initialized, continue
      }
    });
    
    it('should allow transfers', async function () {
      const amount = ethers.parseEther('1000');
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      const deployerWallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, provider);
      
      // Transfer tokens from deployer to user1
      await tokenTemplate.transfer(user1, amount);
      
      // Check balances
      expect(await tokenTemplate.balanceOf(user1)).toBe(amount);
      expect(await tokenTemplate.balanceOf(deployer)).toBe(initialSupply - amount);
    });
    
    it('should allow owner to mint new tokens', async function () {
      const mintAmount = ethers.parseEther('5000');
      const initialTotal = await tokenTemplate.totalSupply();
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      const ownerWallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, provider);
      
      // Mint tokens to user2
      await tokenTemplate.mint(user2, mintAmount);
      
      // Check balance and total supply
      expect(await tokenTemplate.balanceOf(user2)).toBe(mintAmount);
      expect(await tokenTemplate.totalSupply()).toBe(initialTotal + mintAmount);
    });
    
    it('should prevent non-owner from minting', async function () {
      const mintAmount = ethers.parseEther('1000');
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      const user1Wallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, provider);
      
      // Try to mint tokens as non-owner, should fail
      await expect(
        tokenTemplate.connect(user1Wallet).mint(user1, mintAmount)
      ).rejects.toThrow("Ownable: caller is not the owner");
    });
    
    it('should allow users to burn their tokens when burning is enabled', async function () {
      const burnAmount = ethers.parseEther('500');
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      const user1Wallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, provider);
      
      // Get initial balances
      const initialBalance = await tokenTemplate.balanceOf(user1);
      const initialTotal = await tokenTemplate.totalSupply();
      
      // Burn tokens
      await tokenTemplate.connect(user1Wallet).burn(burnAmount);
      
      // Check balances
      expect(await tokenTemplate.balanceOf(user1)).toBe(initialBalance - burnAmount);
      expect(await tokenTemplate.totalSupply()).toBe(initialTotal - burnAmount);
    });
    
    it('should apply tax when transferring tokens', async function() {
      const transferAmount = ethers.parseEther('100');
      const expectedTaxAmount = (transferAmount * BigInt(taxRate)) / BigInt(10000);
      const expectedReceivedAmount = transferAmount - expectedTaxAmount;
      
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      const user2Wallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, provider);
      
      // Get initial balances
      const initialUser1Balance = await tokenTemplate.balanceOf(user1);
      const initialUser2Balance = await tokenTemplate.balanceOf(user2);
      const initialTaxRecipientBalance = await tokenTemplate.balanceOf(taxRecipient);
      
      // Perform transfer
      await tokenTemplate.connect(user2Wallet).transfer(user1, transferAmount);
      
      // Verify balances after transfer
      const user1Balance = await tokenTemplate.balanceOf(user1);
      const user2Balance = await tokenTemplate.balanceOf(user2);
      const taxRecipientBalance = await tokenTemplate.balanceOf(taxRecipient);
      
      // User2 should have sent the full amount
      expect(user2Balance).toBe(initialUser2Balance - transferAmount);
      
      // User1 should have received amount minus tax
      expect(user1Balance).toBe(initialUser1Balance + expectedReceivedAmount);
      
      // Tax recipient should have received the tax amount
      expect(taxRecipientBalance).toBe(initialTaxRecipientBalance + expectedTaxAmount);
    });
  });
  
  describe('ERC20 functionality', function () {
    it('should have correct decimals', async function () {
      expect(await tokenTemplate.decimals()).toBe(18);
    });
    
    it('should handle allowances correctly', async function () {
      const approvalAmount = ethers.parseEther('100');
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      const user1Wallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, provider);
      const user2Wallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, provider);
      
      // Approve user2 to spend user1's tokens
      await tokenTemplate.connect(user1Wallet).approve(user2, approvalAmount);
      
      // Check allowance
      expect(await tokenTemplate.allowance(user1, user2)).toBe(approvalAmount);
      
      // Transfer tokens using transferFrom
      const transferAmount = ethers.parseEther('50');
      const initialSenderBalance = await tokenTemplate.balanceOf(user1);
      const initialReceiverBalance = await tokenTemplate.balanceOf(deployer);
      
      // User2 transfers user1's tokens to deployer
      await tokenTemplate.connect(user2Wallet).transferFrom(user1, deployer, transferAmount);
      
      // Check balances
      expect(await tokenTemplate.balanceOf(user1)).toBe(initialSenderBalance - transferAmount);
      expect(await tokenTemplate.balanceOf(deployer)).toBe(initialReceiverBalance + transferAmount);
      expect(await tokenTemplate.allowance(user1, user2)).toBe(approvalAmount - transferAmount);
    });
  });
}); 