// Type definitions for @openzeppelin/test-helpers
declare module '@openzeppelin/test-helpers' {
  import { BigNumber } from 'ethers';
  
  export class BN {
    constructor(value: string | number | BigNumber);
    add(other: BN): BN;
    sub(other: BN): BN;
    mul(other: BN): BN;
    div(other: BN): BN;
    toString(): string;
  }
  
  export namespace expectEvent {
    function inLogs(logs: any[], eventName: string, eventArgs?: any): void;
    function inReceipt(receipt: any, eventName: string, eventArgs?: any): void;
    // Add other methods as needed
  }
  
  export function expectRevert(promise: Promise<any>, reason?: string): Promise<void>;
  
  export namespace time {
    function increase(seconds: number): Promise<void>;
    function increaseTo(target: number): Promise<void>;
    function latest(): Promise<number>;
    
    namespace duration {
      function seconds(s: number): number;
      function minutes(m: number): number;
      function hours(h: number): number;
      function days(d: number): number;
      function weeks(w: number): number;
      function years(y: number): number;
    }
  }
  
  // Add other exports as needed
} 