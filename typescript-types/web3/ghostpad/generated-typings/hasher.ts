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
  Hasher,
  HasherMethodNames,
  HasherEventsContext,
  HasherEvents
>;
export type HasherEvents = undefined;
export interface HasherEventsContext {}
export type HasherMethodNames = 'MiMCSponge';
export interface MiMCSpongeResponse {
  xL: string;
  xR: string;
}
export interface Hasher {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param in_xL Type: uint256, Indexed: false
   * @param in_xR Type: uint256, Indexed: false
   */
  MiMCSponge(
    in_xL: string,
    in_xR: string
  ): MethodConstantReturnContext<MiMCSpongeResponse>;
}
