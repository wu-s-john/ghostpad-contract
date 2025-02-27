import { ethers } from "hardhat";
import { time } from "@openzeppelin/test-helpers";
import { expect, describe, it, beforeAll } from "vitest";
import * as crypto from "crypto";

// Import TypeChain factories and types
import { 
  TokenTemplate__factory,
  MetadataVerifier__factory, 
  GhostPad__factory, 
  Verifier__factory, 
  Hasher__factory, 
  UniswapHandler__factory, 
  Tornado__factory
} from "../typechain";

import type {
  TokenTemplate,
  MetadataVerifier,
  GhostPad,
  Verifier,
  Hasher,
  UniswapHandler,
  Tornado
} from "../typechain";

// Import helper constants
import { AddressZero } from './helpers/constants';

/**
 * This test demonstrates the complete flow of using GhostPad from the user's perspective:
 * 1. Deposit to Tornado Cash
 * 2. Generate proofs
 * 3. Deploy a memecoin with custom properties
 * 4. Test the deployed memecoin features
 */
describe('GhostPad Example Usage', function () {
  // Account setup
  let accounts: string[];
  let deployer: string;
  let recipient: string;
  let relayer: string;
  let governance: string;
  let user1: string;
  let user2: string;
  
  // Token properties
  const tokenName = "Ghost Memecoin";
  const tokenSymbol = "GHOST";
  const tokenSupply = ethers.parseEther('1000000'); // 1M tokens with 18 decimals
  const tokenDescription = "A privacy-focused memecoin launched anonymously through GhostPad";
  const taxRate = 100; // 1% in basis points
  let taxRecipient: string; // The owner will receive the tax
  const burnEnabled = true; // Allow token burning
  const liquidityLockPeriod = 365 * 24 * 60 * 60; // 1 year
  
  // Deployment properties
  const instanceIndex = 0; // Use the smallest denomination (0.1 ETH)
  const fee = ethers.parseEther('0.001'); // Relayer fee
  const refund = ethers.parseEther('0'); // Refund amount
  
  // Contract instances
  let tokenTemplate: TokenTemplate;
  let metadataVerifier: MetadataVerifier;
  let tornadoInstance: Tornado;
  let ghostPad: GhostPad;
  let uniswapHandler: UniswapHandler;
  let deployedToken: TokenTemplate;
  let hasher: Hasher;
  let verifier: Verifier;
  
  // Commitment data
  let commitment: string;
  let nullifier: string;
  let nullifierHash: string;
  let secret: string;
  
  // Proofs
  let proof: string;
  let root: string;
  let metadataProof: string;
  let metadataHash: string;
  
  /**
   * Generate a commitment for depositing into Tornado
   */
  function generateCommitmentData(): { 
    commitment: string; 
    nullifier: string; 
    nullifierHash: string; 
    secret: string 
  } {
    // Generate random nullifier and secret
    nullifier = '0x' + crypto.randomBytes(31).toString('hex');
    secret = '0x' + crypto.randomBytes(31).toString('hex');
    
    // Hash the nullifier and secret to create commitment
    commitment = ethers.keccak256(ethers.solidityPacked(
      ['bytes32', 'bytes32'],
      [nullifier, secret]
    ));
    
    // Hash the nullifier to get nullifier hash
    nullifierHash = ethers.keccak256(ethers.solidityPacked(
      ['bytes32'],
      [nullifier]
    ));
    
    return { commitment, nullifier, nullifierHash, secret };
  }
  
  /**
   * Generate a mock proof for Tornado withdrawal
   */
  async function generateTornadoProof(): Promise<{ proof: string; root: string }> {
    // Get the current root from the tornado instance
    root = await tornadoInstance.getLastRoot();
    
    // Mock proof data - in a real scenario this would be an actual ZK proof
    proof = '0x00';
    
    return { proof, root };
  }
  
  /**
   * Generate a mock metadata proof
   */
  function generateMetadataProof(): { metadataProof: string; metadataHash: string } {
    // Hash the token metadata
    metadataHash = ethers.keccak256(ethers.solidityPacked(
      ['string', 'uint256', 'string', 'uint256'],
      [tokenName, tokenSupply.toString(), tokenDescription, taxRate.toString()]
    ));
    
    // Mock metadata proof
    metadataProof = '0x00';
    
    return { metadataProof, metadataHash };
  }
  
  /**
   * Create TokenData struct
   */
  interface TokenData {
    name: string;
    symbol: string;
    initialSupply: bigint;
    description: string;
    taxRate: number;
    taxRecipient: string;
    burnEnabled: boolean;
    liquidityLockPeriod: number;
  }
  
  function createTokenData(): TokenData {
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
  interface ProofData {
    instanceIndex: number;
    proof: string;
    root: string;
    nullifierHash: string;
    recipient: string;
    relayer: string;
    fee: bigint;
    refund: bigint;
    metadataProof: string;
    metadataHash: string;
  }
  
  function createProofData(): ProofData {
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
  
  beforeAll(async function() {
    // Get accounts
    const signers = await ethers.getSigners();
    accounts = await Promise.all(signers.map(signer => signer.getAddress()));
    
    deployer = accounts[0];
    recipient = accounts[1];
    relayer = accounts[2];
    governance = accounts[3];
    user1 = accounts[4];
    user2 = accounts[5];
    taxRecipient = recipient;
    
    // Get the deployer signer
    const deployerSigner = await ethers.getSigner(deployer);
    
    // Deploy all the necessary contracts
    console.log("Setting up test environment...");
    
    // 1. Deploy TokenTemplate using Hardhat's getContractFactory and TypeChain connect
    const TokenTemplateContract = await ethers.getContractFactory("TokenTemplate", deployerSigner);
    const tokenTemplateDeployed = await TokenTemplateContract.deploy();
    tokenTemplate = TokenTemplate__factory.connect(await tokenTemplateDeployed.getAddress(), deployerSigner);
    console.log(`TokenTemplate deployed at: ${await tokenTemplate.getAddress()}`);
    
    // 2. Deploy MetadataVerifier using Hardhat's getContractFactory and TypeChain connect
    const MetadataVerifierContract = await ethers.getContractFactory("MetadataVerifier", deployerSigner);
    const metadataVerifierDeployed = await MetadataVerifierContract.deploy();
    metadataVerifier = MetadataVerifier__factory.connect(await metadataVerifierDeployed.getAddress(), deployerSigner);
    console.log(`MetadataVerifier deployed at: ${await metadataVerifier.getAddress()}`);
    
    // 3. Deploy Hasher and Verifier for Tornado using Hardhat's getContractFactory and TypeChain connect
    const HasherContract = await ethers.getContractFactory("Hasher", deployerSigner);
    const hasherDeployed = await HasherContract.deploy();
    hasher = Hasher__factory.connect(await hasherDeployed.getAddress(), deployerSigner);
    
    const VerifierContract = await ethers.getContractFactory("Verifier", deployerSigner);
    const verifierDeployed = await VerifierContract.deploy();
    verifier = Verifier__factory.connect(await verifierDeployed.getAddress(), deployerSigner);
    
    console.log(`Hasher deployed at: ${await hasher.getAddress()}`);
    console.log(`Verifier deployed at: ${await verifier.getAddress()}`);
    
    // 4. Deploy the ETH Tornado instance (0.1 ETH) using Hardhat's getContractFactory and TypeChain connect
    const TornadoContract = await ethers.getContractFactory("Tornado", deployerSigner);
    const merkleTreeHeight = 20;
    const tornadoDeployed = await TornadoContract.deploy(
      await verifier.getAddress(),
      await hasher.getAddress(),
      ethers.parseEther('0.1'),
      merkleTreeHeight
    );
    tornadoInstance = Tornado__factory.connect(await tornadoDeployed.getAddress(), deployerSigner);
    console.log(`Tornado instance deployed at: ${await tornadoInstance.getAddress()}`);
    
    // 5. Deploy UniswapHandler using Hardhat's getContractFactory and TypeChain connect
    const mockUniswapRouter = accounts[7]; // Mock router address
    const UniswapHandlerContract = await ethers.getContractFactory("UniswapHandler", deployerSigner);
    const uniswapHandlerDeployed = await UniswapHandlerContract.deploy(mockUniswapRouter);
    uniswapHandler = UniswapHandler__factory.connect(await uniswapHandlerDeployed.getAddress(), deployerSigner);
    console.log(`UniswapHandler deployed at: ${await uniswapHandler.getAddress()}`);
    
    // 6. Deploy GhostPad using Hardhat's getContractFactory and TypeChain connect
    const GhostPadContract = await ethers.getContractFactory("GhostPad", deployerSigner);
    const ghostPadDeployed = await GhostPadContract.deploy(
      await tokenTemplate.getAddress(),
      governance,
      await metadataVerifier.getAddress(),
      [await tornadoInstance.getAddress()],
      await uniswapHandler.getAddress()
    );
    ghostPad = GhostPad__factory.connect(await ghostPadDeployed.getAddress(), deployerSigner);
    console.log(`GhostPad deployed at: ${await ghostPad.getAddress()}`);
    
    // 7. Generate commitment data
    const commitmentData = generateCommitmentData();
    commitment = commitmentData.commitment;
    nullifier = commitmentData.nullifier;
    nullifierHash = commitmentData.nullifierHash;
    secret = commitmentData.secret;
    
    console.log(`Generated commitment: ${commitment}`);
    console.log(`Generated nullifier hash: ${nullifierHash}`);
    
    // 8. Generate proofs
    const metadataProofData = generateMetadataProof();
    metadataProof = metadataProofData.metadataProof;
    metadataHash = metadataProofData.metadataHash;
  });
  
  describe('Complete GhostPad Usage Flow', function() {
    it('Step 1: Should deposit ETH to Tornado instance', async function() {
      console.log("Making deposit to Tornado instance...");
      
      // Make a deposit to the Tornado instance
      const tx = await tornadoInstance.deposit(commitment, { 
        value: ethers.parseEther('0.1')
      });
      
      // For testing, we just wait for transaction to complete without verifying events
      try {
        await tx;
        console.log("Deposit successful!");
      } catch (error) {
        console.error("Deposit failed:", error);
        throw error;
      }
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
      
      expect(proof).toBe('0x00'); // Mock proof validation
      expect(root).not.toBe('0x0000000000000000000000000000000000000000000000000000000000000000');
      
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
          value: refund
        }
      );
      
      // For testing, we just wait for transaction to complete without verifying events
      try {
        await deployTx;
        console.log("Token deployment transaction completed");
      } catch (error) {
        console.error("Token deployment failed:", error);
        throw error;
      }
      
      // Get the deployed token address
      const tokenAddress = await ghostPad.getDeployedToken(nullifierHash);
      expect(tokenAddress).not.toBe(AddressZero);
      
      // Connect to the deployed token using TypeChain factory
      const deployerSigner = await ethers.getSigner(deployer);
      deployedToken = TokenTemplate__factory.connect(tokenAddress, deployerSigner);
      
      console.log(`Token deployed at address: ${tokenAddress}`);
    });
    
    it('Step 5: Should deploy a token with liquidity through GhostPad', async function() {
      console.log("Generating new commitment for token with liquidity...");
      
      // Generate new commitment to avoid nullifier reuse
      const newCommitmentData = generateCommitmentData();
      const tornadoProof = await generateTornadoProof();
      proof = tornadoProof.proof;
      root = tornadoProof.root;
      
      const metadataProofData = generateMetadataProof();
      metadataProof = metadataProofData.metadataProof;
      metadataHash = metadataProofData.metadataHash;
      
      // Create structured parameters
      const tokenData = createTokenData();
      tokenData.name = "Liquidity Token";
      tokenData.symbol = "LIQD";
      
      const proofData = createProofData();
      
      // Set up liquidity parameters
      const liquidityTokenAmount = ethers.parseEther('100000'); // 100k tokens
      const liquidityEthAmount = ethers.parseEther('10'); // 10 ETH
      
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
          value: liquidityEthAmount + refund
        }
      );
      
      // For testing, we just wait for transaction to complete without verifying events
      try {
        await deployLiquidityTx;
        console.log("Token with liquidity deployment transaction completed");
      } catch (error) {
        console.error("Token with liquidity deployment failed:", error);
        throw error;
      }
      
      console.log("Token with liquidity deployed successfully");
    });
    
    it('Step 6: Should verify token properties', async function() {
      console.log("Verifying token properties...");
      
      // Basic token properties
      expect(await deployedToken.name()).toBe(tokenName);
      expect(await deployedToken.symbol()).toBe(tokenSymbol);
      expect(await deployedToken.description()).toBe(tokenDescription);
      
      // Custom properties specific to GhostPad tokens
      const tokenTaxRate = await deployedToken.taxRate();
      expect(tokenTaxRate).to.equal(BigInt(taxRate));
      expect(await deployedToken.taxRecipient()).toBe(taxRecipient);
      expect(await deployedToken.burnEnabled()).toBe(true);
      
      console.log("Token properties verified!");
    });
    
    it('Step 7: Should verify token balances after deployment', async function() {
      console.log("Verifying initial token balances...");
      
      // 97% of supply should go to recipient, 3% to governance
      const expectedRecipientBalance = tokenSupply * BigInt(97) / BigInt(100);
      const expectedGovernanceBalance = tokenSupply * BigInt(3) / BigInt(100);
      
      const actualRecipientBalance = await deployedToken.balanceOf(recipient);
      const actualGovernanceBalance = await deployedToken.balanceOf(governance);
      
      // Compare as BigInts
      expect(actualRecipientBalance).to.equal(expectedRecipientBalance);
      expect(actualGovernanceBalance).to.equal(expectedGovernanceBalance);
      
      console.log(`Recipient balance: ${ethers.formatEther(actualRecipientBalance)} ${tokenSymbol}`);
      console.log(`Governance balance: ${ethers.formatEther(actualGovernanceBalance)} ${tokenSymbol}`);
    });
    
    it('Step 8: Should apply tax when transferring tokens', async function() {
      console.log("Testing token transfer with tax...");
      
      // Transfer 10,000 tokens to user1
      const transferAmount = ethers.parseEther('10000');
      
      // Calculate expected tax
      const expectedTaxAmount = transferAmount * BigInt(taxRate) / BigInt(10000);
      const expectedReceivedAmount = transferAmount - expectedTaxAmount;
      
      // Get initial balances
      const initialRecipientBalance = await deployedToken.balanceOf(recipient);
      const initialTaxRecipientBalance = await deployedToken.balanceOf(taxRecipient);
      
      // Perform transfer
      await deployedToken.transfer(user1, transferAmount);
      
      // Verify balances after transfer
      const finalRecipientBalance = await deployedToken.balanceOf(recipient);
      const user1Balance = await deployedToken.balanceOf(user1);
      const finalTaxRecipientBalance = await deployedToken.balanceOf(taxRecipient);
      
      // Recipient should have sent the full amount
      expect(finalRecipientBalance).to.equal(initialRecipientBalance - transferAmount);
      
      // User1 should have received amount minus tax
      expect(user1Balance).to.equal(expectedReceivedAmount);
      
      // Tax recipient should have received the tax amount
      const taxRecipientDifference = finalTaxRecipientBalance - initialTaxRecipientBalance;
      expect(taxRecipientDifference).to.equal(expectedTaxAmount);
      
      console.log(`Transfer amount: ${ethers.formatEther(transferAmount)} ${tokenSymbol}`);
      console.log(`Tax amount: ${ethers.formatEther(expectedTaxAmount)} ${tokenSymbol}`);
      console.log(`User1 received: ${ethers.formatEther(user1Balance)} ${tokenSymbol}`);
    });
    
    it('Step 9: Should allow burning tokens when enabled', async function() {
      console.log("Testing token burning functionality...");
      
      // Token burn amount
      const burnAmount = ethers.parseEther('1000');
      
      // Get initial balances
      const initialUser1Balance = await deployedToken.balanceOf(user1);
      const initialTotalSupply = await deployedToken.totalSupply();
      
      // Burn tokens
      const user1Signer = await ethers.getSigner(user1);
      await deployedToken.connect(user1Signer).burn(burnAmount);
      
      // Verify balances after burn
      const finalUser1Balance = await deployedToken.balanceOf(user1);
      const finalTotalSupply = await deployedToken.totalSupply();
      
      // User1 balance should be reduced
      expect(finalUser1Balance).to.equal(initialUser1Balance - burnAmount);
      
      // Total supply should be reduced
      expect(finalTotalSupply).to.equal(initialTotalSupply - burnAmount);
      
      console.log(`Burned amount: ${ethers.formatEther(burnAmount)} ${tokenSymbol}`);
      console.log(`New total supply: ${ethers.formatEther(finalTotalSupply)} ${tokenSymbol}`);
    });
    
    it('Step 10: Should allow token owner to update tax configuration', async function() {
      console.log("Testing token owner configuration updates...");
      
      // Update tax rate to 2%
      const newTaxRate = 200;
      await deployedToken.updateTaxRate(newTaxRate);
      const contractTaxRate = await deployedToken.taxRate();
      expect(contractTaxRate).to.equal(BigInt(newTaxRate));
      
      // Update tax recipient to user2
      await deployedToken.updateTaxRecipient(user2);
      expect(await deployedToken.taxRecipient()).toBe(user2);
      
      // Test transfer with new tax settings
      const transferAmount = ethers.parseEther('5000');
      const expectedTaxAmount = transferAmount * BigInt(newTaxRate) / BigInt(10000);
      
      // Transfer from user1 to relayer
      const user1Signer = await ethers.getSigner(user1);
      await deployedToken.connect(user1Signer).transfer(relayer, transferAmount);
      
      // Verify tax went to new recipient
      const user2Balance = await deployedToken.balanceOf(user2);
      expect(user2Balance).to.equal(expectedTaxAmount);
      
      console.log(`Updated tax rate: ${newTaxRate / 100}%`);
      console.log(`New tax recipient: ${user2}`);
      console.log(`Tax received by new recipient: ${ethers.formatEther(user2Balance)} ${tokenSymbol}`);
    });
    
    it('Step 11: Should allow disabling and re-enabling burn functionality', async function() {
      console.log("Testing burn functionality toggling...");
      
      // Disable burning
      await deployedToken.setBurnEnabled(false);
      expect(await deployedToken.burnEnabled()).toBe(false);
      
      // Try to burn tokens when disabled
      const burnAmount = ethers.parseEther('100');
      const relayerSigner = await ethers.getSigner(relayer);
      
      // Try to burn tokens when disabled - should throw an error
      await expect(
        deployedToken.connect(relayerSigner).burn(burnAmount)
      ).to.be.revertedWith("Burning is disabled for this token");
      
      // Re-enable burning
      await deployedToken.setBurnEnabled(true);
      expect(await deployedToken.burnEnabled()).toBe(true);
      
      // Burn tokens when enabled
      await deployedToken.connect(relayerSigner).burn(burnAmount);
      
      console.log("Burn functionality toggle tested successfully!");
    });
  });
}); 