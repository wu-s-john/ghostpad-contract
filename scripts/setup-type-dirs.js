const fs = require('fs');
const path = require('path');

// Function to create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  const parts = dirPath.split(path.sep);
  let currentPath = '';
  
  for (const part of parts) {
    currentPath = currentPath ? path.join(currentPath, part) : part;
    
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
      console.log(`Created directory: ${currentPath}`);
    }
  }
}

// Create all necessary directories
const directories = [
  'typescript-types/web3/ghostpad/generated-typings',
  'typescript-types/ethers/ghostpad/generated-typings',
  'typescript-types/ethers_v5/ghostpad/generated-typings'
];

console.log('Setting up directories for contract type generation...');
directories.forEach(dir => ensureDirectoryExists(dir));
console.log('Directory setup complete!'); 