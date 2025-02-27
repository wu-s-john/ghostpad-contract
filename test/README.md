# GhostPad Test Suite with TypeScript

This directory contains tests for the GhostPad smart contracts. The tests have been migrated from JavaScript to TypeScript for better type safety and developer experience.

## Setup

The project uses Hardhat with TypeChain integration to automatically generate TypeScript type definitions for all smart contracts.

### Prerequisites

- Node.js (>=14.x)
- Yarn or npm

### Installation

1. Install dependencies:
   ```
   yarn install
   ```
   or
   ```
   npm install
   ```

2. Generate TypeScript type definitions:
   ```
   yarn generate-types
   ```
   or
   ```
   npm run generate-types
   ```

## Running Tests

To run tests with Hardhat:

```
yarn test:hardhat
```
or
```
npm run test:hardhat
```

To run tests with Forge (Foundry):

```
yarn test
```
or
```
npm test
```

## TypeScript Migration Guide

### Converting JavaScript Tests to TypeScript

To convert existing JavaScript tests to TypeScript:

1. Rename the file from `.js` to `.ts`
2. Replace requires with imports:
   ```typescript
   // Before
   const { expect } = require('chai');
   
   // After
   import { expect } from 'chai';
   ```

3. Add type annotations for variables:
   ```typescript
   // Before
   let token;
   
   // After
   let token: TokenTemplate;
   ```

4. Use proper type imports from the generated types:
   ```typescript
   import { TokenTemplate, GhostPad } from '../types/contracts';
   ```

5. Add type casting when working with Truffle artifacts:
   ```typescript
   // Before
   token = await TokenTemplate.new();
   
   // After
   const TokenTemplateContract = artifacts.require("TokenTemplate");
   token = await TokenTemplateContract.new() as TokenTemplate;
   ```

6. Define interfaces for structured data:
   ```typescript
   interface TokenData {
     name: string;
     symbol: string;
     initialSupply: BN;
     // other properties
   }
   ```

### Best Practices

1. Always define return types for functions:
   ```typescript
   function createTokenData(): TokenData {
     // function body
   }
   ```

2. Use proper error handling with type-safe assertions:
   ```typescript
   await expectRevert(
     token.transfer(address, amount, { from: user }),
     "Expected error message"
   );
   ```

3. Add proper TypeScript type annotations for all variables and parameters.

4. Use BN (Big Number) objects for handling numeric values, especially for token amounts and Ethereum values.

5. Use the `as` type assertion only when necessary and when you're sure about the type.

## Type Definitions Structure

- `types/contracts/`: Contains auto-generated TypeScript type definitions for all smart contracts.
- `types/truffle.d.ts`: Contains global type definitions for Truffle-specific objects (artifacts, contract, etc.).

## Troubleshooting

If you encounter issues with TypeScript type definitions:

1. Make sure you've run `yarn generate-types` to generate the latest type definitions.
2. Check that the contract you're trying to use has been compiled successfully.
3. Verify that you're importing the correct type from the types directory.
4. If you get web3 or BN related errors, make sure you're using the proper type conversions.

For any other issues, please open an issue in the GitHub repository.

## Test Files

- **ghostpad.test.js**: Main test file that covers the complete flow from deposit to token deployment and transfer
- **token_template.test.js**: Tests for the TokenTemplate contract functionality
- **mock_verifier.test.js**: Tests for the metadata verification functionality
- **ghostpad_governance.test.js**: Tests for the governance and admin functions

## Prerequisites

Make sure you have installed all the dependencies:

```bash
npm install
```

## Running Tests

To run all tests:

```bash
npm test
```

To run a specific test file:

```bash
npx truffle test test/ghostpad.test.js
```

## Test Coverage

To check test coverage:

```bash
npm run coverage
```

## Notes on Zero-Knowledge Proofs

The tests use mock proofs instead of real zero-knowledge proofs for simplicity and speed. In a production environment, you would need to:

1. Generate proper ZK-SNARKs using libraries like `snarkjs` and `circom`
2. Set up a trusted setup ceremony for the circuits
3. Deploy verifier contracts generated from the ceremony

For the tests, we've simplified this by:
- Mocking the proof generation
- Using a mock verifier that accepts any proof
- Focusing on testing the contract interactions rather than cryptographic security

In a real deployment, you would need to integrate with actual cryptographic libraries to generate valid proofs.

## Testing Flow

1. **Setup**: Deploy TokenTemplate, MetadataVerifier, Tornado instances, and GhostPad
2. **Deposit**: Make a deposit to a Tornado instance
3. **Generate Proofs**: Create mock proofs for both withdrawal and metadata
4. **Deploy Token**: Use the proofs to deploy a new token through GhostPad
5. **Transfer Tokens**: Make transfers with the deployed token

This flow mimics the real-world usage of the GhostPad platform. 