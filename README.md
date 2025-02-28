## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Run with Custom Parameters

You can deploy the contracts with custom parameters using the following commands:

#### Forge Command

```shell
# For development with mock contracts
forge script script/DeployDev.s.sol:DeployDevScript \
  --sig "run(address)" \
  --rpc-url <your_rpc_url> \
  --private-key <your_private_key> \
  --broadcast \
  -- 0xYourGovernanceAddress

# For production with real contracts
forge script script/DeployProd.s.sol:DeployProdScript \
  --sig "run(address,address,address[])" \
  --rpc-url <your_rpc_url> \
  --private-key <your_private_key> \
  --broadcast \
  -- 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D 0xYourGovernanceAddress [0xTornado1,0xTornado2,0xTornado3,0xTornado4]
```

#### Node.js Script

```shell
# For development with mock contracts
node scripts/run.js --mode dev --governance 0xYourGovernanceAddress

# For production with real contracts
node scripts/run.js --mode prod \
  --uniswapRouter 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D \
  --governance 0xYourGovernanceAddress \
  --tornadoInstances 0xFirst,0xSecond,0xThird,0xFourth
```

In both cases, the scripts will generate a `deployment-info.json` file with details about the deployed contracts.

### Deploy with Foundry

GhostPad provides two different deployment scripts for different environments:

#### Production Deployment

For production or testnet environments, use the `DeployProd.s.sol` script with all necessary external addresses as function parameters:

```shell
# Set private key for deployment
export PRIVATE_KEY=your_private_key

# Run the production deployment script with constructor arguments
forge script script/DeployProd.s.sol:DeployProdScript \
  --sig "run(address,address,address[])" \
  --rpc-url <your_rpc_url> \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -- 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D 0xYourGovernanceAddress [0xTornado1,0xTornado2,0xTornado3,0xTornado4]
```

Parameters for the production script:
1. Uniswap Router address (required)
2. Governance address (required)
3. Array of Tornado instances (at least one required)

#### Development Deployment

For local development and testing, use the `DeployDev.s.sol` script, which automatically deploys all necessary mock contracts:

```shell
# Set private key for deployment
export PRIVATE_KEY=your_private_key

# Run with default governance (deployer)
forge script script/DeployDev.s.sol:DeployDevScript \
  --sig "run(address)" \
  --rpc-url <your_rpc_url> \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -- 0x0000000000000000000000000000000000000000

# Or run with custom governance address
forge script script/DeployDev.s.sol:DeployDevScript \
  --sig "run(address)" \
  --rpc-url <your_rpc_url> \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -- 0xYourGovernanceAddress
```

Parameters for the development script:
1. Governance address (optional, defaults to deployer if zero address is provided)

The development script will:
- Deploy mock Uniswap contracts (Factory, Router, and Pair)
- Deploy four mock Tornado instances with denominations of 0.1, 1, 10, and 100 ETH
- Use your deployer address as governance if not specified

This provides a complete test environment without needing any external dependencies.

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

### Node.js Execution

The project includes a Node.js script for easy deployment:

```shell
# Install dependencies
npm install

# Set required private key
export PRIVATE_KEY=your_private_key
export RPC_URL=your_rpc_url

# For development deployment (with automatic mock contracts)
node scripts/run.js --mode dev

# For production deployment (requires all external addresses)
node scripts/run.js --mode prod \
  --uniswapRouter 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D \
  --governance 0xYourGovernanceAddress \
  --tornadoInstances 0xFirst,0xSecond,0xThird,0xFourth
```

The Node.js script supports two deployment modes:

1. **Development Mode** (`--mode dev`): Automatically deploys all mock contracts. Only requires a private key.
2. **Production Mode** (`--mode prod`): Requires all external addresses to be provided.

All parameters should be specified as command-line arguments:
- `--mode`: Deployment mode (`dev` or `prod`)
- `--uniswapRouter`: Address of the Uniswap Router contract (required for prod)
- `--governance`: Address that will control protocol parameters (required for prod, optional for dev)
- `--tornadoInstances`: Comma-separated list of Tornado Cash instance addresses (required for prod)

Required environment variables:
- `PRIVATE_KEY`: Private key for the deployer account
- `RPC_URL`: RPC endpoint for the target network (defaults to http://127.0.0.1:8545 for local development)

The script will:
1. Deploy the TokenTemplate contract
2. Deploy the appropriate Uniswap contracts (mock or use provided address)
3. Deploy the GhostPad contract with the specified parameters
4. Set the initial governance fee to 3%
5. Save all deployment information to `deployment-info.json`

### Quick Deployment with NPM Scripts

For convenience, you can use the npm scripts for deployment:

```shell
# Development deployment with mock contracts
# Set governance address (optional, defaults to deployer)
export GOVERNANCE_ADDRESS=0xYourGovernanceAddress
export PRIVATE_KEY=your_private_key
export RPC_URL=your_rpc_url

npm run deploy:dev
# or
yarn deploy:dev
```

```shell
# Production deployment
# All parameters are required
export UNISWAP_ROUTER=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
export GOVERNANCE_ADDRESS=0xYourGovernanceAddress
export TORNADO_INSTANCES="[0xTornado1,0xTornado2,0xTornado3,0xTornado4]"
export PRIVATE_KEY=your_private_key
export RPC_URL=your_rpc_url

npm run deploy:prod
# or
yarn deploy:prod
```

### Verified Deployment

To automatically verify contracts on Etherscan (or other supported explorers) during deployment:

```shell
# Development deployment with contract verification
export GOVERNANCE_ADDRESS=0xYourGovernanceAddress
export PRIVATE_KEY=your_private_key
export RPC_URL=your_rpc_url
export ETHERSCAN_API_KEY=your_etherscan_api_key

npm run deploy:dev:verify
# or
yarn deploy:dev:verify
```

```shell
# Production deployment with contract verification
export UNISWAP_ROUTER=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
export GOVERNANCE_ADDRESS=0xYourGovernanceAddress
export TORNADO_INSTANCES="[0xTornado1,0xTornado2,0xTornado3,0xTornado4]"
export PRIVATE_KEY=your_private_key
export RPC_URL=your_rpc_url
export ETHERSCAN_API_KEY=your_etherscan_api_key

npm run deploy:prod:verify
# or
yarn deploy:prod:verify
```

These scripts are shortcuts to the Forge deployment commands and accept the same parameters through environment variables.
