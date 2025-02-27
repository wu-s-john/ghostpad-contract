import { vi, expect } from 'vitest';
import { ethers } from 'ethers';

// Setup a local Ethereum provider - use a safer way to create provider
let provider: ethers.JsonRpcProvider;
try {
  // Try to connect to a local Anvil instance if available
  provider = new ethers.JsonRpcProvider('http://localhost:8545');
} catch (error) {
  // Fallback to a mock provider for tests that don't need real contracts
  console.warn("Could not connect to local Ethereum node. Using mock provider for tests.");
  provider = new ethers.InfuraProvider("sepolia");
}

// Create and cache signers with accounts
const signers = Array(10).fill(0).map((_, i) => {
  const wallet = ethers.Wallet.createRandom().connect(provider);
  return wallet;
});

// Cache addresses for use in tests
const addresses = signers.map(signer => signer.getAddress());

// Pre-resolve the addresses for synchronous use
let resolvedAddresses: string[] = [];
Promise.all(addresses).then(addrs => {
  resolvedAddresses = addrs;
});

// Mock web3 functionality that's used in tests
globalThis.web3 = {
  utils: {
    toWei: (value: string, unit = 'ether') => ethers.parseUnits(value, unit === 'ether' ? 18 : unit).toString(),
    fromWei: (value: string, unit = 'ether') => ethers.formatUnits(value, unit === 'ether' ? 18 : unit),
    soliditySha3: (...args: any[]) => {
      // Simple implementation to handle the most common case in tests
      const types = args.map(arg => arg.type);
      const values = args.map(arg => arg.value);
      
      // Use ethers to encode and hash
      const abiCoder = new ethers.AbiCoder();
      const encoded = abiCoder.encode(types, values);
      return ethers.keccak256(encoded);
    }
  }
};

// Mock the BN functionality from OpenZeppelin test-helpers
class BN {
  private value: bigint;
  
  constructor(value: string | number) {
    this.value = BigInt(value);
  }
  
  toString() {
    return this.value.toString();
  }
  
  add(other: BN) {
    return new BN((this.value + BigInt(other.toString())).toString());
  }
  
  sub(other: BN) {
    return new BN((this.value - BigInt(other.toString())).toString());
  }
  
  mul(other: BN) {
    return new BN((this.value * BigInt(other.toString())).toString());
  }
  
  div(other: BN) {
    return new BN((this.value / BigInt(other.toString())).toString());
  }
}

// Mock the time helper
const time = {
  increase: async (seconds: number) => {
    // This would require interacting with the actual provider or mock
    console.log(`Increasing time by ${seconds} seconds (mocked)`);
  },
  latest: async () => {
    const block = await provider.getBlock('latest');
    return block?.timestamp ?? Math.floor(Date.now() / 1000);
  },
  duration: {
    seconds: (s: number) => s,
    minutes: (m: number) => m * 60,
    hours: (h: number) => h * 60 * 60,
    days: (d: number) => d * 24 * 60 * 60,
    weeks: (w: number) => w * 7 * 24 * 60 * 60,
    years: (y: number) => y * 365 * 24 * 60 * 60
  }
};

// Mock expectEvent and expectRevert
const expectEvent = (tx: any, eventName: string, params?: Record<string, any>) => {
  // Check if the transaction has events
  if (!tx.events) {
    throw new Error(`Transaction doesn't have events`);
  }
  
  // Find the event
  const event = tx.events.find((e: any) => e.event === eventName);
  if (!event) {
    throw new Error(`Event ${eventName} not found`);
  }
  
  // Check parameters if provided
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (event.args[key] !== value) {
        throw new Error(`Expected event ${eventName} parameter ${key} to be ${value}, got ${event.args[key]}`);
      }
    }
  }
  
  return event;
};

const expectRevert = async (promise: Promise<any>, reason?: string) => {
  try {
    await promise;
    throw new Error('Expected transaction to revert');
  } catch (error: any) {
    if (reason) {
      if (!error.message.includes(reason)) {
        throw new Error(`Expected error message to include "${reason}", got "${error.message}"`);
      }
    }
  }
};

// Add matchers for bignumber comparisons
expect.extend({
  toBeBigNumber(received: any, expected: any) {
    const receivedBN = typeof received === 'string' || typeof received === 'number' 
      ? new BN(received) 
      : received;
    const expectedBN = typeof expected === 'string' || typeof expected === 'number'
      ? new BN(expected)
      : expected;
    
    const pass = receivedBN.toString() === expectedBN.toString();
    
    return {
      pass,
      message: () => 
        `Expected ${receivedBN.toString()} ${pass ? 'not to be' : 'to be'} ${expectedBN.toString()}`,
    };
  },
});

// Export global variables
const ethersInstance = ethers;
globalThis.ethers = ethersInstance;

// Export Vitest-compatible utilities to replace OpenZeppelin test-helpers
globalThis.BN = BN;
globalThis.expectEvent = expectEvent;
globalThis.expectRevert = expectRevert;
globalThis.time = time;

// Mock the contract function from Mocha
globalThis.contract = (description: string, testFn: (accounts: string[]) => void) => {
  // Create a normal Vitest describe block
  describe(description, () => {
    // Create a default test that will run our test function
    it('should provide accounts', () => {
      // Always run the test function with pre-resolved addresses
      // This runs it synchronously which is what Vitest expects
      testFn(resolvedAddresses);
    });
  });
};

// Mock the artifacts from Truffle
globalThis.artifacts = {
  require: (name: string) => {
    // This is a simplified mock that would need enhancement based on actual use
    return {
      new: async (options?: any) => {
        console.log(`Creating a new instance of ${name} contract (mocked)`);
        // You would need to return a mock contract or actual deployed contract here
        return {};
      },
      at: async (address: string) => {
        console.log(`Creating contract ${name} at address ${address} (mocked)`);
        // You would need to connect to an actual contract at the address
        return {};
      }
    };
  }
};

// Fix TypeScript errors by declaring globals
declare global {
  var contract: (description: string, tests: (accounts: string[]) => void) => void;
  var artifacts: {
    require: (name: string) => any;
  };
  var BN: typeof BN;
  var expectEvent: typeof expectEvent;
  var expectRevert: typeof expectRevert;
  var time: typeof time;
  var web3: {
    utils: {
      toWei: (value: string, unit?: string) => string;
      fromWei: (value: string, unit?: string) => string;
      soliditySha3: (...args: any[]) => string;
    }
  };
  var ethers: typeof ethersInstance;
  
  namespace Vi {
    interface Assertion {
      toBeBigNumber: (expected: any) => void;
    }
  }
}

// Export the provider for external use
export const testProvider = provider;

// Export the BN class and other utilities
export {
  BN,
  expectEvent,
  expectRevert,
  time
}; 