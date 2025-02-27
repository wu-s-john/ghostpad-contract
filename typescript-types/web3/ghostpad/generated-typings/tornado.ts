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
  Tornado,
  TornadoMethodNames,
  TornadoEventsContext,
  TornadoEvents
>;
export type TornadoEvents = 'Deposit' | 'Withdrawal';
export interface TornadoEventsContext {
  Deposit(
    parameters: {
      filter?: { commitment?: string | number[] | string | number[][] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  Withdrawal(
    parameters: {
      filter?: { relayer?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
}
export type TornadoMethodNames =
  | 'FIELD_SIZE'
  | 'ROOT_HISTORY_SIZE'
  | 'ZERO_VALUE'
  | 'commitments'
  | 'currentRootIndex'
  | 'denomination'
  | 'deposit'
  | 'filledSubtrees'
  | 'getLastRoot'
  | 'hashLeftRight'
  | 'hasher'
  | 'isKnownRoot'
  | 'isSpent'
  | 'isSpentArray'
  | 'levels'
  | 'nextIndex'
  | 'nullifierHashes'
  | 'roots'
  | 'verifier'
  | 'withdraw'
  | 'zeros';
export interface DepositEventEmittedResponse {
  commitment: string | number[];
  leafIndex: string | number;
  timestamp: string;
}
export interface WithdrawalEventEmittedResponse {
  to: string;
  nullifierHash: string | number[];
  relayer: string;
  fee: string;
}
export interface Tornado {
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
   * @param parameter0 Type: bytes32, Indexed: false
   */
  commitments(
    parameter0: string | number[]
  ): MethodConstantReturnContext<boolean>;
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
   */
  denomination(): MethodConstantReturnContext<string>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _commitment Type: bytes32, Indexed: false
   */
  deposit(_commitment: string | number[]): MethodPayableReturnContext;
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
   * @param _nullifierHash Type: bytes32, Indexed: false
   */
  isSpent(
    _nullifierHash: string | number[]
  ): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _nullifierHashes Type: bytes32[], Indexed: false
   */
  isSpentArray(
    _nullifierHashes: string | number[][]
  ): MethodConstantReturnContext<boolean[]>;
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
   * @param parameter0 Type: bytes32, Indexed: false
   */
  nullifierHashes(
    parameter0: string | number[]
  ): MethodConstantReturnContext<boolean>;
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
   * StateMutability: view
   * Type: function
   */
  verifier(): MethodConstantReturnContext<string>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _proof Type: bytes, Indexed: false
   * @param _root Type: bytes32, Indexed: false
   * @param _nullifierHash Type: bytes32, Indexed: false
   * @param _recipient Type: address, Indexed: false
   * @param _relayer Type: address, Indexed: false
   * @param _fee Type: uint256, Indexed: false
   * @param _refund Type: uint256, Indexed: false
   */
  withdraw(
    _proof: string | number[],
    _root: string | number[],
    _nullifierHash: string | number[],
    _recipient: string,
    _relayer: string,
    _fee: string,
    _refund: string
  ): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param i Type: uint256, Indexed: false
   */
  zeros(i: string): MethodConstantReturnContext<string>;
}
