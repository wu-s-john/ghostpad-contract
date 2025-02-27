import { ContractTransaction } from 'ethers';
import { Arrayish, BigNumber, BigNumberish, Interface } from 'ethers/utils';
import { EthersContractContext } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContext<
  MerkleTree,
  MerkleTreeEventsContext,
  MerkleTreeEvents
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
  'new'(
    _treeLevels: BigNumberish,
    _hasher: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
   */
  currentRootIndex(overrides?: ContractCallOverrides): Promise<number>;
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _leaf Type: bytes32, Indexed: false
   */
  insert(
    _leaf: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
   * @param parameter0 Type: uint256, Indexed: false
   */
  roots(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param i Type: uint256, Indexed: false
   */
  zeros(i: BigNumberish, overrides?: ContractCallOverrides): Promise<string>;
}
