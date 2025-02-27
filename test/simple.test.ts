import { describe, it, expect, beforeAll } from "vitest";
import { ethers } from "ethers";
import { BN, time, testProvider } from "./setup.esm";

describe('Simple Tests for Utilities', () => {
  let provider: ethers.JsonRpcProvider;

  beforeAll(() => {
    provider = testProvider;
  });

  describe('BN Class', () => {
    it('should handle basic arithmetic', () => {
      const a = new BN(100);
      const b = new BN(50);
      
      expect(a.add(b).toString()).toEqual('150');
      expect(a.sub(b).toString()).toEqual('50');
      expect(a.mul(b).toString()).toEqual('5000');
      expect(a.div(b).toString()).toEqual('2');
    });
  });

  describe('Web3 Utils Mock', () => {
    it('should convert to and from Wei', () => {
      const etherAmount = '1.5';
      const weiAmount = web3.utils.toWei(etherAmount);
      
      expect(weiAmount).toEqual('1500000000000000000');
      expect(web3.utils.fromWei(weiAmount)).toEqual('1.5');
    });

    it('should compute keccak256 hash', () => {
      const hash = web3.utils.soliditySha3(
        { type: 'uint256', value: '100' },
        { type: 'address', value: '0x1234567890123456789012345678901234567890' }
      );
      
      expect(hash).toBeTruthy();
      expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
    });
  });

  describe('Time Helpers', () => {
    it('should calculate durations correctly', () => {
      expect(time.duration.minutes(1)).toEqual(60);
      expect(time.duration.hours(1)).toEqual(3600);
      expect(time.duration.days(1)).toEqual(86400);
      expect(time.duration.weeks(1)).toEqual(604800);
    });
  });
});

// Create a separate contract test block
contract('Contract Function Tests', (accounts) => {
  // The accounts should be available here directly
  expect(accounts.length).toBeGreaterThan(0);
  expect(accounts[0]).toMatch(/^0x[0-9a-fA-F]{40}$/);
}); 