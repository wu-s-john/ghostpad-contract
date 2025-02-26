// Example script showing how to use GhostPad for anonymous token launching
// This is for demonstration purposes only and uses some simplified steps

const Web3 = require('web3');
const { BN } = require('@openzeppelin/test-helpers');
const crypto = require('crypto');

// Contract artifacts
const GhostPad = artifacts.require("GhostPad");
const ETHTornado = artifacts.require("ETHTornado");
const TokenTemplate = artifacts.require("TokenTemplate");
const UniswapHandler = artifacts.require("UniswapHandler");

/**
 * Generate a commitment for depositing into Tornado
 * Note: In a real implementation, you would use more secure randomness
 */
async function generateCommitment() {
  // Generate random nullifier and secret
  const nullifier = '0x' + crypto.randomBytes(31).toString('hex');
  const secret = '0x' + crypto.randomBytes(31).toString('hex');
  
  // Hash the nullifier and secret to create commitment
  const commitment = web3.utils.soliditySha3(
    { type: 'bytes32', value: nullifier },
    { type: 'bytes32', value: secret }
  );
  
  // Hash the nullifier to get nullifier hash
  const nullifierHash = web3.utils.soliditySha3(
    { type: 'bytes32', value: nullifier }
  );
  
  return { commitment, nullifier, nullifierHash, secret };
}

/**
 * Generate mock tornado proofs
 * Note: In a real implementation, you would use a real zk-SNARK prover
 */
async function generateProofs(tornadoInstance, nullifierHash) {
  // Get the current merkle root from the instance
  const root = await tornadoInstance.getLastRoot();
  
  // Mock proof data - in a real scenario this would be an actual ZK proof
  const proof = '0x00';
  
  return { proof, root, nullifierHash };
}

/**
 * Generate a mock metadata proof
 * Note: In a real implementation, you would use a real zk-SNARK prover
 */
function generateMetadataProof(name, supply, description, taxRate) {
  // Hash the token metadata
  const metadataHash = web3.utils.soliditySha3(
    { type: 'string', value: name },
    { type: 'uint256', value: supply.toString() },
    { type: 'string', value: description },
    { type: 'uint256', value: taxRate.toString() }
  );
  
  // Mock metadata proof - in a real scenario this would be an actual ZK proof
  const metadataProof = '0x00';
  
  return { metadataProof, metadataHash };
}

/**
 * Example of using GhostPad to anonymously deploy a token
 */
module.exports = async function() {
  try {
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];
    const recipient = accounts[1];
    const relayer = accounts[2];
    
    console.log("Using accounts:");
    console.log(`- Deployer: ${deployer}`);
    console.log(`- Recipient: ${recipient}`);
    console.log(`- Relayer: ${relayer}`);
    
    // Get deployed instances
    const ghostPad = await GhostPad.deployed();
    console.log(`GhostPad address: ${ghostPad.address}`);
    
    // Get the first Tornado instance (0.1 ETH)
    const instanceIndex = 0;
    const instanceInfo = await ghostPad.getTornadoInstance(instanceIndex);
    const tornadoInstance = await ETHTornado.at(instanceInfo.instance);
    console.log(`Using Tornado instance at ${tornadoInstance.address} with denomination ${web3.utils.fromWei(instanceInfo.denomination)} ETH`);
    
    // Generate commitment data
    const { commitment, nullifier, nullifierHash, secret } = await generateCommitment();
    console.log(`Generated commitment: ${commitment}`);
    console.log(`Generated nullifier hash: ${nullifierHash}`);
    
    // Make a deposit to the Tornado instance
    console.log(`Making deposit to Tornado instance...`);
    await tornadoInstance.deposit(commitment, { 
      from: deployer,
      value: instanceInfo.denomination,
      gas: 1000000
    });
    console.log(`Deposit successful`);
    
    // In a real scenario, you would wait for some time and then generate
    // the withdrawal proof separately to maintain anonymity
    console.log(`Waiting for deposit to be processed...`);
    // Simulating waiting time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate proofs for withdrawal
    console.log(`Generating proofs...`);
    const { proof, root } = await generateProofs(tornadoInstance, nullifierHash);
    
    // Set up token metadata
    const tokenName = "Ghost Memecoin";
    const tokenSymbol = "GHOST";
    const tokenSupply = web3.utils.toWei('1000000');
    const tokenDescription = "A privacy-focused memecoin launched anonymously through GhostPad";
    const taxRate = 100; // 1% in basis points
    const taxRecipient = recipient; // the owner will receive the tax
    const burnEnabled = true; // allow token burning
    
    // Set up configurable and optional features
    const liquidityLockPeriod = 60 * 60 * 24 * 30; // 30 days lock period
    const useProtocolFee = true; // Set to false to avoid the protocol fee
    const vestingEnabled = true; // Set to false to disable vesting functionality
    
    // Generate metadata proof
    const { metadataProof, metadataHash } = generateMetadataProof(
      tokenName, 
      tokenSupply,
      tokenDescription,
      taxRate
    );
    
    // Set up relayer fee and refund
    const fee = web3.utils.toWei('0.001');
    const refund = web3.utils.toWei('0');
    
    // EXAMPLE 1: DEPLOY BASIC TOKEN WITHOUT LIQUIDITY
    console.log(`\n=== EXAMPLE 1: DEPLOYING BASIC TOKEN ===`);
    console.log(`Deploying token through GhostPad...`);
    
    const deployTx = await ghostPad.deployToken(
      instanceIndex,
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
      useProtocolFee,
      vestingEnabled,
      {
        from: deployer,
        value: refund,
        gas: 5000000
      }
    );
    
    console.log(`Token deployment transaction hash: ${deployTx.tx}`);
    
    // Get the deployed token address
    const tokenAddress = await ghostPad.getDeployedToken(nullifierHash);
    console.log(`Deployed token address: ${tokenAddress}`);
    
    // Get token details
    const token = await TokenTemplate.at(tokenAddress);
    console.log(`Token details:`);
    console.log(`- Name: ${await token.name()}`);
    console.log(`- Symbol: ${await token.symbol()}`);
    console.log(`- Description: ${await token.description()}`);
    console.log(`- Total supply: ${web3.utils.fromWei(await token.totalSupply())} ${tokenSymbol}`);
    console.log(`- Tax rate: ${await token.taxRate()} basis points (${(await token.taxRate()) / 100}%)`);
    console.log(`- Tax recipient: ${await token.taxRecipient()}`);
    console.log(`- Burn enabled: ${await token.burnEnabled()}`);
    console.log(`- Vesting enabled: ${await token.vestingEnabled()}`);
    
    // Show balances
    const ownerBalance = await token.balanceOf(recipient);
    const governanceFee = await ghostPad.governanceFee();
    const governanceBalance = await token.balanceOf(await ghostPad.governance());
    
    console.log(`Balances:`);
    console.log(`- Owner: ${web3.utils.fromWei(ownerBalance)} ${tokenSymbol}`);
    console.log(`- Governance: ${web3.utils.fromWei(governanceBalance)} ${tokenSymbol} (Fee: ${governanceFee/100}%)`);
    
    console.log(`\nToken deployed successfully! Use this token address to interact with your memecoin: ${tokenAddress}`);
    
    // EXAMPLE 2: DEPLOY TOKEN WITH LIQUIDITY
    // We need a different nullifier hash for this example
    console.log(`\n=== EXAMPLE 2: DEPLOYING TOKEN WITH LIQUIDITY ===`);
    
    // Generate new commitment data
    const liquidity = await generateCommitment();
    console.log(`Generated new nullifier hash for liquidity example: ${liquidity.nullifierHash}`);
    
    // Make a deposit to the Tornado instance
    console.log(`Making another deposit to Tornado instance...`);
    await tornadoInstance.deposit(liquidity.commitment, { 
      from: deployer,
      value: instanceInfo.denomination,
      gas: 1000000
    });
    
    // Generate proofs for withdrawal
    const liquidityProofs = await generateProofs(tornadoInstance, liquidity.nullifierHash);
    
    // Get the Uniswap handler
    const uniswapHandler = await UniswapHandler.deployed();
    console.log(`UniswapHandler address: ${uniswapHandler.address}`);
    
    // Set up liquidity parameters
    const liquidityTokenAmount = web3.utils.toWei('100000'); // 10% of supply for liquidity
    const liquidityEthAmount = web3.utils.toWei('1'); // 1 ETH for liquidity
    
    // Calculate total ETH needed (liquidity + refund)
    const totalEthNeeded = new BN(liquidityEthAmount).add(new BN(refund));
    
    console.log(`Deploying token with liquidity...`);
    const liquidityTx = await ghostPad.deployTokenWithLiquidity(
      instanceIndex,
      liquidityProofs.proof,
      liquidityProofs.root,
      liquidity.nullifierHash,
      recipient,
      relayer,
      fee,
      refund,
      `${tokenName} Liquidity`,
      `${tokenSymbol}L`,
      tokenSupply,
      metadataProof,
      metadataHash,
      `${tokenDescription} with Locked Liquidity`,
      taxRate,
      taxRecipient,
      burnEnabled,
      liquidityLockPeriod,
      liquidityTokenAmount,
      liquidityEthAmount,
      useProtocolFee,
      vestingEnabled,
      {
        from: deployer,
        value: totalEthNeeded,
        gas: 6000000
      }
    );
    
    console.log(`Token with liquidity deployment transaction hash: ${liquidityTx.tx}`);
    
    // Get the deployed token address
    const tokenWithLiquidityAddress = await ghostPad.getDeployedToken(liquidity.nullifierHash);
    console.log(`Deployed token with liquidity address: ${tokenWithLiquidityAddress}`);
    
    // Get the liquidity pool info
    const liquidityPoolInfo = liquidityTx.logs.find(log => log.event === 'LiquidityPoolCreated');
    if (liquidityPoolInfo) {
      console.log(`Liquidity pool created:`);
      console.log(`- Pair address: ${liquidityPoolInfo.args.pairAddress}`);
      console.log(`- Liquidity amount: ${liquidityPoolInfo.args.liquidityAdded.toString()}`);
      console.log(`- Locked until: ${new Date((await token.liquidityLockEndTime()).toNumber() * 1000).toISOString()}`);
    }
    
    // EXAMPLE 3: DEPLOY TOKEN WITHOUT PROTOCOL FEE AND VESTING
    console.log(`\n=== EXAMPLE 3: DEPLOYING TOKEN WITHOUT PROTOCOL FEE AND VESTING ===`);
    
    // Generate new commitment data
    const noFee = await generateCommitment();
    console.log(`Generated new nullifier hash for no-fee example: ${noFee.nullifierHash}`);
    
    // Make a deposit to the Tornado instance
    console.log(`Making a third deposit to Tornado instance...`);
    await tornadoInstance.deposit(noFee.commitment, { 
      from: deployer,
      value: instanceInfo.denomination,
      gas: 1000000
    });
    
    // Generate proofs for withdrawal
    const noFeeProofs = await generateProofs(tornadoInstance, noFee.nullifierHash);
    
    console.log(`Deploying token without protocol fee and vesting...`);
    const noFeeTx = await ghostPad.deployToken(
      instanceIndex,
      noFeeProofs.proof,
      noFeeProofs.root,
      noFee.nullifierHash,
      recipient,
      relayer,
      fee,
      refund,
      `${tokenName} NoFee`,
      `${tokenSymbol}NF`,
      tokenSupply,
      metadataProof,
      metadataHash,
      `${tokenDescription} without Protocol Fee or Vesting`,
      taxRate,
      taxRecipient,
      burnEnabled,
      liquidityLockPeriod,
      false, // No protocol fee
      false, // No vesting
      {
        from: deployer,
        value: refund,
        gas: 5000000
      }
    );
    
    console.log(`No fee token deployment transaction hash: ${noFeeTx.tx}`);
    
    // Get the deployed token address
    const noFeeTokenAddress = await ghostPad.getDeployedToken(noFee.nullifierHash);
    console.log(`Deployed token without protocol fee address: ${noFeeTokenAddress}`);
    
    // Get token details
    const noFeeToken = await TokenTemplate.at(noFeeTokenAddress);
    console.log(`Token details:`);
    console.log(`- Name: ${await noFeeToken.name()}`);
    console.log(`- Symbol: ${await noFeeToken.symbol()}`);
    console.log(`- Vesting enabled: ${await noFeeToken.vestingEnabled()}`);
    
    // Show balances
    const noFeeOwnerBalance = await noFeeToken.balanceOf(recipient);
    const noFeeGovernanceBalance = await noFeeToken.balanceOf(await ghostPad.governance());
    
    console.log(`Balances:`);
    console.log(`- Owner: ${web3.utils.fromWei(noFeeOwnerBalance)} ${await noFeeToken.symbol()} (100% of supply)`);
    console.log(`- Governance: ${web3.utils.fromWei(noFeeGovernanceBalance)} ${await noFeeToken.symbol()} (0% - No fee applied)`);
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`1. Basic Token with protocol fee and vesting: ${tokenAddress}`);
    console.log(`2. Token with Locked Liquidity: ${tokenWithLiquidityAddress}`);
    console.log(`3. Token without protocol fee and vesting: ${noFeeTokenAddress}`);
    
    return { 
      tokenAddress, 
      tokenWithLiquidityAddress,
      noFeeTokenAddress
    };
    
  } catch (error) {
    console.error(`Error in example script:`, error);
    throw error;
  }
}; 