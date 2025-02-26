# GhostPad Test Suite

This directory contains a comprehensive test suite for the GhostPad platform. The tests cover the entire flow from depositing funds to a Tornado instance, generating proofs, deploying a memecoin, and making transfers.

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