import { ContractTransaction } from 'ethers';
import { Arrayish, BigNumber, BigNumberish, Interface } from 'ethers/utils';
import { EthersContractContext } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContext<
  Tornado,
  TornadoEventsContext,
  TornadoEvents
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
export type TornadoEvents = 'Deposit' | 'Withdrawal';
export interface TornadoEventsContext {
  Deposit(...parameters: any): EventFilter;
  Withdrawal(...parameters: any): EventFilter;
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
  commitment: Arrayish;
  leafIndex: BigNumberish;
  timestamp: BigNumberish;
}
export interface WithdrawalEventEmittedResponse {
  to: string;
  nullifierHash: Arrayish;
  relayer: string;
  fee: BigNumberish;
}
export interface Tornado {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  FIELD_SIZE(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  ROOT_HISTORY_SIZE(overrides?: ContractCallOverrides): Promise<number>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  ZERO_VALUE(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes32, Indexed: false
   */
  commitments(
    parameter0: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  currentRootIndex(overrides?: ContractCallOverrides): Promise<number>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  denomination(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _commitment Type: bytes32, Indexed: false
   */
  deposit(
    _commitment: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  filledSubtrees(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getLastRoot(overrides?: ContractCallOverrides): Promise<string>;
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
    _left: Arrayish,
    _right: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  hasher(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _root Type: bytes32, Indexed: false
   */
  isKnownRoot(
    _root: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _nullifierHash Type: bytes32, Indexed: false
   */
  isSpent(
    _nullifierHash: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _nullifierHashes Type: bytes32[], Indexed: false
   */
  isSpentArray(
    _nullifierHashes: Arrayish[],
    overrides?: ContractCallOverrides
  ): Promise<boolean[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  levels(overrides?: ContractCallOverrides): Promise<number>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  nextIndex(overrides?: ContractCallOverrides): Promise<number>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes32, Indexed: false
   */
  nullifierHashes(
    parameter0: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  roots(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  verifier(overrides?: ContractCallOverrides): Promise<string>;
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
    _proof: Arrayish,
    _root: Arrayish,
    _nullifierHash: Arrayish,
    _recipient: string,
    _relayer: string,
    _fee: BigNumberish,
    _refund: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param i Type: uint256, Indexed: false
   */
  zeros(i: BigNumberish, overrides?: ContractCallOverrides): Promise<string>;
}
