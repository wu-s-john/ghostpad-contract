const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

// Parse command line arguments
const mode = argv.mode || 'dev'; // Default to development mode
const uniswapRouterAddress = argv.uniswapRouter || process.env.UNISWAP_ROUTER;
const tornadoInstancesStr = argv.tornadoInstances || process.env.TORNADO_INSTANCES;
const governanceAddress = argv.governance || process.env.GOVERNANCE_ADDRESS;

// Function to validate an Ethereum address
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Check deployment mode
console.log(`Deployment mode: ${mode.toUpperCase()}`);

// Check if we're in production mode
if (mode === 'prod') {
  // Validate required parameters for production
  if (!uniswapRouterAddress || !isValidAddress(uniswapRouterAddress)) {
    console.error('Error: Invalid or missing Uniswap Router address in production mode. Use --uniswapRouter 0x... or set UNISWAP_ROUTER environment variable.');
    process.exit(1);
  }
  
  if (!governanceAddress || !isValidAddress(governanceAddress)) {
    console.error('Error: Invalid or missing governance address in production mode. Use --governance 0x... or set GOVERNANCE_ADDRESS environment variable.');
    process.exit(1);
  }
  
  // Parse tornado instances (comma-separated addresses)
  let tornadoInstances = [];
  if (tornadoInstancesStr) {
    tornadoInstances = tornadoInstancesStr.split(',');
    for (const address of tornadoInstances) {
      if (!isValidAddress(address)) {
        console.error(`Error: Invalid tornado instance address: ${address}`);
        process.exit(1);
      }
    }
  } else {
    console.error('Error: No Tornado instances provided in production mode. Use --tornadoInstances 0x1,0x2,... or set TORNADO_INSTANCES environment variable.');
    process.exit(1);
  }
  
  // Log the parameters for production
  console.log('===== GhostPad Production Deployment Parameters =====');
  console.log(`Uniswap Router Address: ${uniswapRouterAddress}`);
  console.log(`Governance Address: ${governanceAddress}`);
  console.log(`Tornado Instances (${tornadoInstances.length}):`);
  tornadoInstances.forEach((addr, i) => console.log(`  ${i + 1}. ${addr}`));
  console.log('=====================================================');
} else {
  // Development mode - will deploy mock contracts
  console.log('===== GhostPad Development Deployment Parameters =====');
  console.log('Uniswap Router: Will deploy mock Uniswap contracts');
  
  if (governanceAddress && isValidAddress(governanceAddress)) {
    console.log(`Governance Address: ${governanceAddress}`);
  } else {
    console.log('Governance Address: Will use deployer address');
  }
  
  console.log('Tornado Instances: Will deploy four MockTornadoInstance contracts with denominations: 0.1, 1, 10, and 100 ETH');
  console.log('=====================================================');
}

// Run the deployment with these parameters
async function main() {
  try {
    // Load provider
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
    
    // Get deployer wallet from private key
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      console.error('Error: PRIVATE_KEY environment variable not set');
      process.exit(1);
    }
    
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(`Deployer address: ${wallet.address}`);

    // Use deployer address as governance if not provided (only in dev mode)
    const actualGovernance = (mode === 'dev' && (!governanceAddress || !isValidAddress(governanceAddress))) 
      ? wallet.address 
      : governanceAddress;
    
    // Load contract factories
    const tokenTemplateAbi = require('../out/TokenTemplate.sol/TokenTemplate.json').abi;
    const ghostPadAbi = require('../out/GhostPad.sol/GhostPad.json').abi;
    const uniswapHandlerAbi = require('../out/UniswapHandler.sol/UniswapHandler.json').abi;
    const mockTornadoInstanceAbi = require('../out/MockTornadoInstance.sol/MockTornadoInstance.json').abi;
    const mockUniswapFactoryAbi = require('../out/MockUniswapFactory.sol/MockUniswapFactory.json').abi;
    const mockUniswapRouterAbi = require('../out/MockUniswapRouter.sol/MockUniswapRouter.json').abi;
    const mockUniswapPairAbi = require('../out/MockUniswapPair.sol/MockUniswapPair.json').abi;
    
    const tokenTemplateBytecode = require('../out/TokenTemplate.sol/TokenTemplate.json').bytecode;
    const ghostPadBytecode = require('../out/GhostPad.sol/GhostPad.json').bytecode;
    const uniswapHandlerBytecode = require('../out/UniswapHandler.sol/UniswapHandler.json').bytecode;
    const mockTornadoInstanceBytecode = require('../out/MockTornadoInstance.sol/MockTornadoInstance.json').bytecode;
    const mockUniswapFactoryBytecode = require('../out/MockUniswapFactory.sol/MockUniswapFactory.json').bytecode;
    const mockUniswapRouterBytecode = require('../out/MockUniswapRouter.sol/MockUniswapRouter.json').bytecode;
    const mockUniswapPairBytecode = require('../out/MockUniswapPair.sol/MockUniswapPair.json').bytecode;
    
    // Create contract factories
    const TokenTemplateFactory = new ethers.ContractFactory(tokenTemplateAbi, tokenTemplateBytecode, wallet);
    const GhostPadFactory = new ethers.ContractFactory(ghostPadAbi, ghostPadBytecode, wallet);
    const UniswapHandlerFactory = new ethers.ContractFactory(uniswapHandlerAbi, uniswapHandlerBytecode, wallet);
    const MockTornadoInstanceFactory = new ethers.ContractFactory(mockTornadoInstanceAbi, mockTornadoInstanceBytecode, wallet);
    const MockUniswapFactoryFactory = new ethers.ContractFactory(mockUniswapFactoryAbi, mockUniswapFactoryBytecode, wallet);
    const MockUniswapRouterFactory = new ethers.ContractFactory(mockUniswapRouterAbi, mockUniswapRouterBytecode, wallet);
    const MockUniswapPairFactory = new ethers.ContractFactory(mockUniswapPairAbi, mockUniswapPairBytecode, wallet);
    
    // Deploy contracts
    console.log('Deploying TokenTemplate...');
    const tokenTemplate = await TokenTemplateFactory.deploy();
    await tokenTemplate.waitForDeployment();
    const tokenTemplateAddress = await tokenTemplate.getAddress();
    console.log(`TokenTemplate deployed at: ${tokenTemplateAddress}`);
    
    // Deploy UniswapHandler
    let uniswapHandler;
    let uniswapHandlerAddress;
    let mockRouterAddress;
    let useMockUniswap = (mode === 'dev');
    
    if (useMockUniswap) {
      // Define WETH address for testing
      const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Mainnet WETH address
      
      console.log('Deploying mock Uniswap contracts...');
      
      // Deploy MockUniswapFactory with zero address
      const mockFactory = await MockUniswapFactoryFactory.deploy(ethers.ZeroAddress);
      await mockFactory.waitForDeployment();
      const mockFactoryAddress = await mockFactory.getAddress();
      console.log(`MockUniswapFactory deployed at: ${mockFactoryAddress}`);
      
      // Deploy MockUniswapPair
      const mockPair = await MockUniswapPairFactory.deploy(
        ethers.ZeroAddress, // token0 (mock token)
        wethAddress // token1 (WETH)
      );
      await mockPair.waitForDeployment();
      const mockPairAddress = await mockPair.getAddress();
      console.log(`MockUniswapPair deployed at: ${mockPairAddress}`);
      
      // Deploy MockUniswapRouter
      const mockRouter = await MockUniswapRouterFactory.deploy(
        mockFactoryAddress,
        wethAddress
      );
      await mockRouter.waitForDeployment();
      mockRouterAddress = await mockRouter.getAddress();
      console.log(`MockUniswapRouter deployed at: ${mockRouterAddress}`);
      
      // Configure the router to use our pair
      await mockRouter.setMockPair(mockPairAddress);
      console.log(`MockUniswapRouter configured to use MockUniswapPair`);
      
      // Deploy UniswapHandler with mock router
      console.log('Deploying UniswapHandler with mock router...');
      uniswapHandler = await UniswapHandlerFactory.deploy(mockRouterAddress);
    } else {
      // Deploy UniswapHandler with provided router
      console.log('Deploying UniswapHandler with provided router...');
      uniswapHandler = await UniswapHandlerFactory.deploy(uniswapRouterAddress);
      mockRouterAddress = null;
    }
    
    await uniswapHandler.waitForDeployment();
    uniswapHandlerAddress = await uniswapHandler.getAddress();
    console.log(`UniswapHandler deployed at: ${uniswapHandlerAddress}`);
    
    // Handle tornado instances
    let tornadoInstances = [];
    
    if (mode === 'dev') {
      // In dev mode, always deploy mock instances
      console.log('Deploying four MockTornadoInstance contracts...');
      const denominations = [
        ethers.parseEther('0.1'),
        ethers.parseEther('1'),
        ethers.parseEther('10'),
        ethers.parseEther('100')
      ];
      
      for (const denomination of denominations) {
        console.log(`Deploying MockTornadoInstance with ${ethers.formatEther(denomination)} ETH denomination...`);
        const mockTornado = await MockTornadoInstanceFactory.deploy(denomination);
        await mockTornado.waitForDeployment();
        const mockTornadoAddress = await mockTornado.getAddress();
        console.log(`MockTornadoInstance deployed at: ${mockTornadoAddress}`);
        tornadoInstances.push(mockTornadoAddress);
      }
      
      console.log('All MockTornadoInstance contracts deployed successfully.');
    } else {
      // In prod mode, use provided instances
      tornadoInstances = tornadoInstancesStr.split(',');
    }
    
    console.log('Deploying GhostPad...');
    const ghostPad = await GhostPadFactory.deploy(
      tokenTemplateAddress,
      actualGovernance,
      tornadoInstances,
      uniswapHandlerAddress
    );
    await ghostPad.waitForDeployment();
    const ghostPadAddress = await ghostPad.getAddress();
    console.log(`GhostPad deployed at: ${ghostPadAddress}`);
    
    // Set initial governance fee (3%)
    console.log('Setting initial governance fee...');
    const tx = await ghostPad.updateGovernanceFee(300);
    await tx.wait();
    console.log('Governance fee set to 3%');
    
    // Save deployment info to file
    const deploymentInfo = {
      network: process.env.NETWORK || 'development',
      mode: mode,
      timestamp: new Date().toISOString(),
      contracts: {
        tokenTemplate: tokenTemplateAddress,
        uniswapHandler: uniswapHandlerAddress,
        ghostPad: ghostPadAddress
      },
      parameters: {
        uniswapRouter: useMockUniswap ? mockRouterAddress : uniswapRouterAddress,
        governance: actualGovernance,
        tornadoInstances: tornadoInstances,
        usedMockUniswap: useMockUniswap
      }
    };
    
    fs.writeFileSync(
      path.join(__dirname, '../deployment-info.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('Deployment information saved to deployment-info.json');
    console.log('Deployment completed successfully!');
    
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

// Execute the main function
main(); 