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
  MerkleTree,
  MerkleTreeMethodNames,
  MerkleTreeEventsContext,
  MerkleTreeEvents
>;
export type MerkleTreeEvents = undefined;
export interface MerkleTreeEventsContext {}
export type MerkleTreeMethodNames =
  | 'new'
  | 'FIELD_SIZE'
  | 'ROOT_HISTORY_SIZE'
  | 'ZERO_VALUE'
  | 'currentRootIndex'
  | 'filledSubtrees'
  | 'getLastRoot'
  | 'hashLeftRight'
  | 'hasher'
  | 'insert'
  | 'isKnownRoot'
  | 'levels'
  | 'nextIndex'
  | 'roots'
  | 'zeros';
export interface MerkleTree {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _treeLevels Type: uint32, Indexed: false
   * @param _hasher Type: address, Indexed: false
   */
  'new'(_treeLevels: string | number, _hasher: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  FIELD_SIZE(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  ROOT_HISTORY_SIZE(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  ZERO_VALUE(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  currentRootIndex(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  filledSubtrees(parameter0: string): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getLastRoot(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param _hasher Type: address, Indexed: false
   * @param _left Type: bytes32, Indexed: false
   * @param _right Type: bytes32, Indexed: false
   */
  hashLeftRight(
    _hasher: string,
    _left: string | number[],
    _right: string | number[]
  ): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  hasher(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _leaf Type: bytes32, Indexed: false
   */
  insert(_leaf: string | number[]): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _root Type: bytes32, Indexed: false
   */
  isKnownRoot(_root: string | number[]): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  levels(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  nextIndex(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  roots(parameter0: string): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param i Type: uint256, Indexed: false
   */
  zeros(i: string): MethodConstantReturnContext<string>;
}
