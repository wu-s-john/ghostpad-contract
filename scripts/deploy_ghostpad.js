const TokenTemplate = artifacts.require("TokenTemplate");
const GhostPad = artifacts.require("GhostPad");
const UniswapHandler = artifacts.require("UniswapHandler");

// For demonstration only - in production, use actual deployed instances
const ETHTornado = artifacts.require("ETHTornado");
const ERC20Tornado = artifacts.require("ERC20Tornado");
const Verifier = artifacts.require("Verifier");
const Hasher = artifacts.require("Hasher"); 

// For testing, use mock implementations
const MockUniswapRouter = artifacts.require("MockUniswapRouter");
const MockUniswapFactory = artifacts.require("MockUniswapFactory");
const MockUniswapPair = artifacts.require("MockUniswapPair");

// Example ERC20 token
const MockERC20 = artifacts.require("MockERC20");

module.exports = async function(deployer, network, accounts) {
  const governance = accounts[1];
  const owner = accounts[0];
  
  console.log("===============================================");
  console.log("Deploying GhostPad Anonymous Token Launch Platform");
  console.log("===============================================");
  
  // Step 1: Deploy the token template
  console.log("Deploying TokenTemplate...");
  await deployer.deploy(TokenTemplate);
  const tokenTemplate = await TokenTemplate.deployed();
  console.log(`TokenTemplate deployed at: ${tokenTemplate.address}`);
  
  // Deploy Hasher and Verifier (needed for Tornado)
  console.log("Deploying Hasher and Verifier for Tornado instances...");
  await deployer.deploy(Hasher);
  const hasher = await Hasher.deployed();
  
  await deployer.deploy(Verifier);
  const verifier = await Verifier.deployed();
  
  // Define ETH denominations
  const ethDenominations = [
    web3.utils.toWei("0.1"),
    web3.utils.toWei("1"),
    web3.utils.toWei("10"),
    web3.utils.toWei("100")
  ];
  
  const merkleTreeHeight = 20;
  
  // Deploy the 4 ETH Tornado instances with standard denominations
  console.log("Deploying ETH Tornado instances...");
  const tornadoInstances = [];
  
  for (const denomination of ethDenominations) {
    await deployer.deploy(
      ETHTornado,
      verifier.address,
      hasher.address,
      denomination,
      merkleTreeHeight
    );
    const instance = await ETHTornado.deployed();
    tornadoInstances.push(instance.address);
    console.log(`ETHTornado with ${web3.utils.fromWei(denomination)} ETH denomination deployed at: ${instance.address}`);
  }
  
  // Deploy UniswapHandler with real or mock components based on network
  let uniswapHandler;
  
  if (network === 'development' || network === 'test') {
    // For testing, deploy mock Uniswap components and real UniswapHandler
    console.log("Deploying mock Uniswap components for testing...");
    
    // Deploy mock factory with default mock pair
    await deployer.deploy(MockUniswapFactory, "0x0000000000000000000000000000000000000000");
    const mockFactory = await MockUniswapFactory.deployed();
    console.log(`MockUniswapFactory deployed at: ${mockFactory.address}`);
    
    // Deploy mock router with mock factory
    await deployer.deploy(MockUniswapRouter, mockFactory.address, accounts[9]); // Use account 9 as WETH
    const mockRouter = await MockUniswapRouter.deployed();
    console.log(`MockUniswapRouter deployed at: ${mockRouter.address}`);
    
    // Deploy real UniswapHandler with mock router
    console.log("Deploying UniswapHandler with mock router...");
    await deployer.deploy(UniswapHandler, mockRouter.address);
    uniswapHandler = await UniswapHandler.deployed();
    console.log(`UniswapHandler deployed at: ${uniswapHandler.address} with mock router ${mockRouter.address}`);
  } else {
    // For production networks, use actual Uniswap router addresses
    console.log("Deploying UniswapHandler...");
    const routerAddress = {
      'mainnet': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // Uniswap V2 Router
      'rinkeby': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      'ropsten': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      'kovan': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      'goerli': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
    }[network] || '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; // Default to mainnet
    
    await deployer.deploy(UniswapHandler, routerAddress);
    uniswapHandler = await UniswapHandler.deployed();
    console.log(`UniswapHandler deployed at: ${uniswapHandler.address} with router ${routerAddress}`);
  }
  
  // Step 3: Deploy GhostPad with the Tornado instances in the constructor
  console.log("Deploying GhostPad with pre-configured Tornado instances...");
  await deployer.deploy(
    GhostPad,
    tokenTemplate.address,
    governance,
    tornadoInstances,
    uniswapHandler.address
  );
  const ghostPad = await GhostPad.deployed();
  console.log(`GhostPad deployed at: ${ghostPad.address}`);
  
  // Deploy additional ERC20 Tornado instances if needed (for testing)
  if (network === 'development' || network === 'test') {
    console.log("\nDeploying additional ERC20 Tornado instances for testing...");
    
    // Deploy MockERC20 token for ERC20Tornado
    await deployer.deploy(MockERC20, "Mock DAI", "mDAI", web3.utils.toWei("10000"));
    const mockDai = await MockERC20.deployed();
    
    const erc20Denominations = [
      web3.utils.toWei("100"),
      web3.utils.toWei("1000")
    ];
    
    // Deploy ERC20 Tornado instances
    const erc20TornadoInstances = [];
    for (const denomination of erc20Denominations) {
      await deployer.deploy(
        ERC20Tornado,
        verifier.address,
        hasher.address,
        denomination,
        merkleTreeHeight,
        mockDai.address
      );
      const instance = await ERC20Tornado.deployed();
      erc20TornadoInstances.push({
        address: instance.address,
        denomination: denomination
      });
      console.log(`ERC20Tornado with ${web3.utils.fromWei(denomination)} DAI denomination deployed at: ${instance.address}`);
      
      // Note: We no longer add these to GhostPad since the addTornadoInstance function was removed
      console.log(`Note: ERC20Tornado instances can no longer be added to GhostPad after deployment`);
    }
  }
  
  // Set initial governance fee (can be updated later by governance)
  await ghostPad.updateGovernanceFee(300); // 3% fee in basis points
  
  console.log("\nDeployment Summary:");
  console.log(`GhostPad: ${ghostPad.address}`);
  console.log(`TokenTemplate: ${tokenTemplate.address}`);
  console.log(`UniswapHandler: ${uniswapHandler.address}`);
  console.log(`Governance: ${governance}`);
  console.log(`Governance Fee: ${await ghostPad.governanceFee()} basis points`);
  console.log(`ETH Tornado instances: ${tornadoInstances.length}`);
  
  console.log("\nDeployment completed successfully!");
}; 