import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import {
  PromiEvent,
  TransactionReceipt,
  EventResponse,
  EventData,
  Web3ContractContext,
} from 'ethereum-abi-types-generator';

export interface CallOptions {
  from?: string;
  gasPrice?: string;
  gas?: number;
}

export interface SendOptions {
  from: string;
  value?: number | string | BN | BigNumber;
  gasPrice?: string;
  gas?: number;
}

export interface EstimateGasOptions {
  from?: string;
  value?: number | string | BN | BigNumber;
  gas?: number;
}

export interface MethodPayableReturnContext {
  send(options: SendOptions): PromiEvent<TransactionReceipt>;
  send(
    options: SendOptions,
    callback: (error: Error, result: any) => void
  ): PromiEvent<TransactionReceipt>;
  estimateGas(options: EstimateGasOptions): Promise<number>;
  estimateGas(
    options: EstimateGasOptions,
    callback: (error: Error, result: any) => void
  ): Promise<number>;
  encodeABI(): string;
}

export interface MethodConstantReturnContext<TCallReturn> {
  call(): Promise<TCallReturn>;
  call(options: CallOptions): Promise<TCallReturn>;
  call(
    options: CallOptions,
    callback: (error: Error, result: TCallReturn) => void
  ): Promise<TCallReturn>;
  encodeABI(): string;
}

export interface MethodReturnContext extends MethodPayableReturnContext {}

export type ContractContext = Web3ContractContext<
  MetadataVerifier,
  MetadataVerifierMethodNames,
  MetadataVerifierEventsContext,
  MetadataVerifierEvents
>;
export type MetadataVerifierEvents = undefined;
export interface MetadataVerifierEventsContext {}
export type MetadataVerifierMethodNames = 'verifyProof';
export interface MetadataVerifier {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param proof Type: bytes, Indexed: false
   * @param input Type: uint256[2], Indexed: false
   */
  verifyProof(
    proof: string | number[],
    input: [string, string, string]
  ): MethodConstantReturnContext<boolean>;
}
