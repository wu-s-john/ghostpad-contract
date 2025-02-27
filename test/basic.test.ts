import { describe, it, expect } from 'vitest';
import { BN } from './setup.esm';

describe('Basic Test', () => {
  it('should pass a simple assertion', () => {
    expect(true).toBe(true);
  });

  it('should work with our BN class', () => {
    const a = new BN(100);
    const b = new BN(50);
    
    expect(a.add(b).toString()).toEqual('150');
    expect(a.sub(b).toString()).toEqual('50');
    expect(a.mul(b).toString()).toEqual('5000');
    expect(a.div(b).toString()).toEqual('2');
  });
}); 