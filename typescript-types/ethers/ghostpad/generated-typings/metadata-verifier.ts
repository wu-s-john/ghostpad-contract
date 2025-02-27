import { ContractTransaction } from 'ethers';
import { Arrayish, BigNumber, BigNumberish, Interface } from 'ethers/utils';
import { EthersContractContext } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContext<
  MetadataVerifier,
  MetadataVerifierEventsContext,
  MetadataVerifierEvents
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
    proof: Arrayish,
    input: [BigNumberish, BigNumberish, BigNumberish],
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
}
