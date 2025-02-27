// vitest-compatibility.mjs
// This file provides compatibility shims for older Node.js versions
import fs from 'fs';
import path from 'path';

// Add constants to fs/promises if not available
if (!fs.promises.constants) {
  fs.promises.constants = fs.constants;
}

export const patchModules = () => {
  console.log('Patching modules for compatibility with Node.js v16');
};

// Run the patch function
patchModules(); 