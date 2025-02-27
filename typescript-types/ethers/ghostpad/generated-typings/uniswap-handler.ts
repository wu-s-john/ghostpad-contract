import { ContractTransaction } from 'ethers';
import { Arrayish, BigNumber, BigNumberish, Interface } from 'ethers/utils';
import { EthersContractContext } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContext<
  UniswapHandler,
  UniswapHandlerEventsContext,
  UniswapHandlerEvents
>;

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: string | number;
  toBlock?: string | number;
};

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type UniswapHandlerEvents =
  | 'LiquidityAdded'
  | 'LiquidityLocked'
  | 'OwnershipTransferred';
export interface UniswapHandlerEventsContext {
  LiquidityAdded(...parameters: any): EventFilter;
  LiquidityLocked(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
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
  0: string;
  isLocked: boolean;
  1: boolean;
  unlockTime: BigNumber;
  2: BigNumber;
  lpBalance: BigNumber;
  3: BigNumber;
  length: 4;
}
export interface LiquidityInfoResponse {
  pair: string;
  0: string;
  isLocked: boolean;
  1: boolean;
  unlockTime: BigNumber;
  2: BigNumber;
  length: 3;
}
export interface LiquidityAddedEventEmittedResponse {
  token: string;
  pair: string;
  amountToken: BigNumberish;
  amountETH: BigNumberish;
  liquidity: BigNumberish;
}
export interface LiquidityLockedEventEmittedResponse {
  token: string;
  pair: string;
  lockPeriod: BigNumberish;
  unlockTime: BigNumberish;
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
  'new'(
    _uniswapRouterAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
    tokenAmount: BigNumberish,
    ethAmount: BigNumberish,
    lockPeriod: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   */
  createPair(
    tokenAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   */
  getLiquidityInfo(
    tokenAddress: string,
    overrides?: ContractCallOverrides
  ): Promise<GetLiquidityInfoResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  liquidityInfo(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<LiquidityInfoResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   */
  pairExists(
    tokenAddress: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   */
  transferLPTokens(
    tokenAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(
    newOwner: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  uniswapFactoryAddress(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  uniswapRouterAddress(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  wethAddress(overrides?: ContractCallOverrides): Promise<string>;
}
