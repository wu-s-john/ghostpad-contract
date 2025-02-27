import { vi } from 'vitest';
import { ethers } from 'ethers';
import hre from 'hardhat';
import '@nomicfoundation/hardhat-ethers';

// Make Hardhat Runtime Environment available globally
globalThis.hre = hre;

// Mock web3 functionality that's used in tests
globalThis.web3 = {
  utils: {
    toWei: (value: string, unit = 'ether') => ethers.parseUnits(value, unit === 'ether' ? 18 : unit),
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

// Mock the time helper from OpenZeppelin test-helpers
const time = {
  increase: async (seconds: number) => {
    await hre.network.provider.send("evm_increaseTime", [seconds]);
    await hre.network.provider.send("evm_mine");
  },
  latest: async () => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    const block = await hre.ethers.provider.getBlock(blockNumber);
    return block!.timestamp;
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

// Export Vitest-compatible utilities to replace OpenZeppelin test-helpers
globalThis.BN = BN;
globalThis.expectEvent = expectEvent;
globalThis.expectRevert = expectRevert;
globalThis.time = time;

// Mock the contract function from Mocha
globalThis.contract = (description: string, tests: (accounts: string[]) => void) => {
  describe(description, () => {
    // Get the accounts from Hardhat
    const accounts: string[] = [];
    
    beforeAll(async () => {
      const signers = await hre.ethers.getSigners();
      for (const signer of signers) {
        accounts.push(await signer.getAddress());
      }
    });
    
    // Call the tests with the accounts
    tests(accounts);
  });
};

// Mock the artifacts from Truffle
globalThis.artifacts = {
  require: (name: string) => {
    // This is a simplified mock - you'd need to enhance this based on your needs
    return {
      new: async (options?: any) => {
        // Return a mock contract
        const factory = await hre.ethers.getContractFactory(name);
        return await factory.deploy();
      },
      at: async (address: string) => {
        // Return a mock contract at address
        const factory = await hre.ethers.getContractFactory(name);
        return factory.attach(address);
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
  var hre: typeof hre;
  
  namespace Vi {
    interface Assertion {
      toBeBigNumber: (expected: any) => void;
    }
  }
}

export {}; 