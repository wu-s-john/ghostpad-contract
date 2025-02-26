const TokenTemplate = artifacts.require("TokenTemplate");
const MetadataVerifier = artifacts.require("MetadataVerifier");
const GhostPad = artifacts.require("GhostPad");
const ETHTornado = artifacts.require("ETHTornado");
const Verifier = artifacts.require("Verifier");
const Hasher = artifacts.require("Hasher");
const UniswapHandler = artifacts.require("UniswapHandler");

const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('GhostPad Governance', function (accounts) {
  const deployer = accounts[0];
  const initialGovernance = accounts[1];
  const newGovernance = accounts[2];
  const unauthorized = accounts[3];
  const mockUniswapRouter = accounts[4];
  
  let tokenTemplate;
  let metadataVerifier;
  let newMetadataVerifier;
  let ethTornado01;
  let ghostPad;
  let uniswapHandler;
  
  before(async function () {
    // Set up contracts
    tokenTemplate = await TokenTemplate.new({ from: deployer });
    metadataVerifier = await MetadataVerifier.new({ from: deployer });
    newMetadataVerifier = await MetadataVerifier.new({ from: deployer });
    
    const hasher = await Hasher.new({ from: deployer });
    const verifier = await Verifier.new({ from: deployer });
    
    // Deploy a test Tornado instance
    const merkleTreeHeight = 20;
    ethTornado01 = await ETHTornado.new(
      verifier.address,
      hasher.address,
      web3.utils.toWei('0.1'),
      merkleTreeHeight,
      { from: deployer }
    );
    
    // Deploy UniswapHandler
    uniswapHandler = await UniswapHandler.new(
      mockUniswapRouter,
      { from: deployer }
    );
    
    // Deploy GhostPad with a single Tornado instance
    ghostPad = await GhostPad.new(
      tokenTemplate.address,
      initialGovernance,
      metadataVerifier.address,
      [
        ethTornado01.address,
        ethTornado01.address, // Using the same instance for simplicity
        ethTornado01.address,
        ethTornado01.address
      ],
      uniswapHandler.address,
      { from: deployer }
    );
  });
  
  describe('Governance functions', function () {
    it('should have correct initial governance address', async function () {
      expect(await ghostPad.governance()).to.equal(initialGovernance);
    });
    
    it('should only allow governance to update governance', async function () {
      // Unauthorized attempt to change governance
      await expectRevert(
        ghostPad.updateGovernance(newGovernance, { from: unauthorized }),
        "Only governance can update governance"
      );
      
      // Valid governance update
      const tx = await ghostPad.updateGovernance(newGovernance, { from: initialGovernance });
      
      expect(await ghostPad.governance()).to.equal(newGovernance);
    });
    
    it('should not allow setting governance to zero address', async function () {
      await expectRevert(
        ghostPad.updateGovernance("0x0000000000000000000000000000000000000000", { from: newGovernance }),
        "Invalid governance address"
      );
    });
  });
  
  describe('Owner functions', function () {
    it('should have deployer as owner', async function () {
      expect(await ghostPad.owner()).to.equal(deployer);
    });
    
    it('should allow owner to update metadata verifier', async function () {
      // Unauthorized attempt to change metadata verifier
      await expectRevert(
        ghostPad.updateMetadataVerifier(newMetadataVerifier.address, { from: unauthorized }),
        "Ownable: caller is not the owner"
      );
      
      // Valid metadata verifier update
      await ghostPad.updateMetadataVerifier(newMetadataVerifier.address, { from: deployer });
      
      expect(await ghostPad.metadataVerifier()).to.equal(newMetadataVerifier.address);
    });
    
    it('should not allow setting metadata verifier to zero address', async function () {
      await expectRevert(
        ghostPad.updateMetadataVerifier("0x0000000000000000000000000000000000000000", { from: deployer }),
        "Invalid metadata verifier address"
      );
    });
    
    it('should allow owner to update UniswapHandler', async function () {
      const newUniswapHandler = await UniswapHandler.new(mockUniswapRouter, { from: deployer });
      
      // Unauthorized attempt to change uniswap handler
      await expectRevert(
        ghostPad.updateUniswapHandler(newUniswapHandler.address, { from: unauthorized }),
        "Ownable: caller is not the owner"
      );
      
      // Valid uniswap handler update
      await ghostPad.updateUniswapHandler(newUniswapHandler.address, { from: deployer });
      
      expect(await ghostPad.uniswapHandler()).to.equal(newUniswapHandler.address);
    });
  });
  
  describe('Recovery functions', function () {
    it('should allow owner to recover ETH', async function () {
      // Send some ETH to the contract
      await web3.eth.sendTransaction({
        from: deployer,
        to: ghostPad.address,
        value: web3.utils.toWei('1', 'ether')
      });
      
      const initialBalance = new BN(await web3.eth.getBalance(deployer));
      
      // Recover the ETH
      await ghostPad.recoverETH({ from: deployer });
      
      // Check that ETH was recovered (approximately, since gas costs affect balance)
      const finalBalance = new BN(await web3.eth.getBalance(deployer));
      expect(finalBalance).to.be.bignumber.greaterThan(initialBalance);
      
      // Contract should have no ETH left
      expect(await web3.eth.getBalance(ghostPad.address)).to.equal('0');
    });
    
    it('should allow owner to recover ERC20 tokens', async function () {
      // Create and send some test tokens
      const testToken = await TokenTemplate.new({ from: deployer });
      
      // Use the initialize method with the right parameters
      await testToken.initialize(
        "Test", 
        "TEST", 
        web3.utils.toWei('1000'), 
        deployer, 
        "Test token description", 
        0, // taxRate
        deployer, // taxRecipient
        false, // burnEnabled
        0, // liquidityLockPeriod
        false, // vestingEnabled
        { from: deployer }
      );
      
      const amount = web3.utils.toWei('100');
      await testToken.transfer(ghostPad.address, amount, { from: deployer });
      
      // Check initial balances
      expect(await testToken.balanceOf(ghostPad.address)).to.be.bignumber.equal(amount);
      const initialOwnerBalance = await testToken.balanceOf(deployer);
      
      // Recover the tokens
      await ghostPad.recoverERC20(testToken.address, amount, { from: deployer });
      
      // Verify tokens were recovered
      expect(await testToken.balanceOf(ghostPad.address)).to.be.bignumber.equal('0');
      expect(await testToken.balanceOf(deployer)).to.be.bignumber.equal(
        initialOwnerBalance.add(new BN(amount))
      );
    });
  });
}); 