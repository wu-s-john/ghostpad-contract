import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  Hasher,
  HasherMethodNames,
  HasherEventsContext,
  HasherEvents
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
export type HasherEvents = undefined;
export interface HasherEventsContext {}
export type HasherMethodNames = 'MiMCSponge';
export interface MiMCSpongeResponse {
  xL: BigNumber;
  0: BigNumber;
  xR: BigNumber;
  1: BigNumber;
  length: 2;
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
    in_xL: BigNumberish,
    in_xR: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<MiMCSpongeResponse>;
}
