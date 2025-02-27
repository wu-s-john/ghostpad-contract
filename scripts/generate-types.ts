import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execPromise = promisify(exec);

async function generateTypes() {
  console.log('Generating TypeChain types for contracts...');
  
  // Ensure the types directory exists
  const typesDir = path.join(__dirname, '../types');
  const contractsTypesDir = path.join(typesDir, 'contracts');
  
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir);
  }
  
  if (!fs.existsSync(contractsTypesDir)) {
    fs.mkdirSync(contractsTypesDir);
  }
  
  try {
    // Compile contracts using forge
    console.log('Compiling contracts with forge...');
    await execPromise('forge build');
    
    // Generate typechain types directly
    console.log('Running TypeChain...');
    await execPromise('npx typechain --target ethers-v6 --out-dir types/contracts "out/**/*.json"');
    
    console.log('TypeChain types generated successfully!');
  } catch (error) {
    console.error('Error generating types:', error);
    process.exit(1);
  }
}

// Run the function
generateTypes().catch(console.error); 