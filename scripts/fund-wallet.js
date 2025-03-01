#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let address = args[0];
let amount = args[1] || 100; // Default to 100 ETH if not specified

// Validate address
if (!address || !address.startsWith('0x') || address.length !== 42) {
  console.error('Error: Please provide a valid Ethereum address');
  console.log('Usage: npm run anvil:fund -- <address> [amount]');
  console.log('Example: npm run anvil:fund -- 0xF19e881BB1A47C5F116E94d82Af687203ce822C9 50');
  process.exit(1);
}

console.log(`Funding ${address} with ${amount} ETH on the local Anvil network...`);

try {
  // Build the command
  const command = `RECIPIENT=${address} AMOUNT=${amount} forge script script/FundWallet.s.sol:FundWallet --rpc-url http://127.0.0.1:8545 --broadcast --legacy`;
  
  // Execute it
  execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  
  console.log(`\nDone! Funded ${address} with ${amount} ETH`);
} catch (error) {
  console.error('\nFunding failed. Make sure your Anvil network is running with:');
  console.error('npx anvil --accounts 10\n');
  process.exit(1);
} 