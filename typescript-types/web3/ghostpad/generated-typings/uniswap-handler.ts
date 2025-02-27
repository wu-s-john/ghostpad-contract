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
  UniswapHandler,
  UniswapHandlerMethodNames,
  UniswapHandlerEventsContext,
  UniswapHandlerEvents
>;
export type UniswapHandlerEvents =
  | 'LiquidityAdded'
  | 'LiquidityLocked'
  | 'OwnershipTransferred';
export interface UniswapHandlerEventsContext {
  LiquidityAdded(
    parameters: {
      filter?: { token?: string | string[]; pair?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  LiquidityLocked(
    parameters: {
      filter?: { token?: string | string[]; pair?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  OwnershipTransferred(
    parameters: {
      filter?: {
        previousOwner?: string | string[];
        newOwner?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
}
export type UniswapHandlerMethodNames =
  | 'new'
  | 'addLiquidity'
  | 'createPair'
  | 'getLiquidityInfo'
  | 'liquidityInfo'
  | 'owner'
  | 'pairExists'
  | 'renounceOwnership'
  | 'transferLPTokens'
  | 'transferOwnership'
  | 'uniswapFactoryAddress'
  | 'uniswapRouterAddress'
  | 'wethAddress';
export interface GetLiquidityInfoResponse {
  pair: string;
  isLocked: boolean;
  unlockTime: string;
  lpBalance: string;
}
export interface LiquidityInfoResponse {
  pair: string;
  isLocked: boolean;
  unlockTime: string;
}
export interface LiquidityAddedEventEmittedResponse {
  token: string;
  pair: string;
  amountToken: string;
  amountETH: string;
  liquidity: string;
}
export interface LiquidityLockedEventEmittedResponse {
  token: string;
  pair: string;
  lockPeriod: string;
  unlockTime: string;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface UniswapHandler {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _uniswapRouterAddress Type: address, Indexed: false
   */
  'new'(_uniswapRouterAddress: string): MethodReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   * @param tokenAmount Type: uint256, Indexed: false
   * @param ethAmount Type: uint256, Indexed: false
   * @param lockPeriod Type: uint256, Indexed: false
   */
  addLiquidity(
    tokenAddress: string,
    tokenAmount: string,
    ethAmount: string,
    lockPeriod: string
  ): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   */
  createPair(tokenAddress: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   */
  getLiquidityInfo(
    tokenAddress: string
  ): MethodConstantReturnContext<GetLiquidityInfoResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  liquidityInfo(
    parameter0: string
  ): MethodConstantReturnContext<LiquidityInfoResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   */
  pairExists(tokenAddress: string): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   */
  transferLPTokens(tokenAddress: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(newOwner: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  uniswapFactoryAddress(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  uniswapRouterAddress(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  wethAddress(): MethodConstantReturnContext<string>;
}
