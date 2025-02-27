import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  Ghostpad,
  GhostpadMethodNames,
  GhostpadEventsContext,
  GhostpadEvents
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
export type GhostpadEvents =
  | 'GovernanceFeeUpdated'
  | 'GovernanceUpdated'
  | 'LiquidityPoolCreated'
  | 'MetadataVerifierUpdated'
  | 'OwnershipTransferred'
  | 'TokenDeployed'
  | 'UniswapHandlerUpdated';
export interface GhostpadEventsContext {
  GovernanceFeeUpdated(...parameters: any): EventFilter;
  GovernanceUpdated(...parameters: any): EventFilter;
  LiquidityPoolCreated(...parameters: any): EventFilter;
  MetadataVerifierUpdated(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  TokenDeployed(...parameters: any): EventFilter;
  UniswapHandlerUpdated(...parameters: any): EventFilter;
}
export type GhostpadMethodNames =
  | 'new'
  | 'MAX_GOVERNANCE_FEE'
  | 'deployToken'
  | 'deployTokenWithLiquidity'
  | 'deployedTokens'
  | 'getDeployedToken'
  | 'getTornadoInstance'
  | 'governance'
  | 'governanceFee'
  | 'instanceCount'
  | 'metadataVerifier'
  | 'nullifierHashUsed'
  | 'owner'
  | 'recoverERC20'
  | 'recoverETH'
  | 'renounceOwnership'
  | 'tokenTemplate'
  | 'tornadoInstances'
  | 'transferOwnership'
  | 'uniswapHandler'
  | 'updateGovernance'
  | 'updateGovernanceFee'
  | 'updateMetadataVerifier'
  | 'updateUniswapHandler';
export interface TokenDataRequest {
  name: string;
  symbol: string;
  initialSupply: BigNumberish;
  description: string;
  taxRate: BigNumberish;
  taxRecipient: string;
  burnEnabled: boolean;
  liquidityLockPeriod: BigNumberish;
}
export interface ProofDataRequest {
  instanceIndex: BigNumberish;
  proof: Arrayish;
  root: Arrayish;
  nullifierHash: Arrayish;
  recipient: string;
  relayer: string;
  fee: BigNumberish;
  refund: BigNumberish;
  metadataProof: Arrayish;
  metadataHash: Arrayish;
}
export interface GetTornadoInstanceResponse {
  instance: string;
  0: string;
  denomination: BigNumber;
  1: BigNumber;
  length: 2;
}
export interface TornadoInstancesResponse {
  instance: string;
  0: string;
  denomination: BigNumber;
  1: BigNumber;
  length: 2;
}
export interface GovernanceFeeUpdatedEventEmittedResponse {
  oldFee: BigNumberish;
  newFee: BigNumberish;
}
export interface GovernanceUpdatedEventEmittedResponse {
  oldGovernance: string;
  newGovernance: string;
}
export interface LiquidityPoolCreatedEventEmittedResponse {
  tokenAddress: string;
  pairAddress: string;
  liquidityAdded: BigNumberish;
}
export interface MetadataVerifierUpdatedEventEmittedResponse {
  oldVerifier: string;
  newVerifier: string;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface TokenDeployedEventEmittedResponse {
  nullifierHash: Arrayish;
  tokenAddress: string;
  name: string;
  symbol: string;
}
export interface UniswapHandlerUpdatedEventEmittedResponse {
  oldHandler: string;
  newHandler: string;
}
export interface Ghostpad {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _tokenTemplate Type: address, Indexed: false
   * @param _governance Type: address, Indexed: false
   * @param _metadataVerifier Type: address, Indexed: false
   * @param _tornadoInstances Type: address[], Indexed: false
   * @param _uniswapHandler Type: address, Indexed: false
   */
  'new'(
    _tokenTemplate: string,
    _governance: string,
    _metadataVerifier: string,
    _tornadoInstances: string[],
    _uniswapHandler: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  MAX_GOVERNANCE_FEE(overrides?: ContractCallOverrides): Promise<number>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenData Type: tuple, Indexed: false
   * @param proofData Type: tuple, Indexed: false
   * @param useProtocolFee Type: bool, Indexed: false
   * @param vestingEnabled Type: bool, Indexed: false
   */
  deployToken(
    tokenData: TokenDataRequest,
    proofData: ProofDataRequest,
    useProtocolFee: boolean,
    vestingEnabled: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenData Type: tuple, Indexed: false
   * @param proofData Type: tuple, Indexed: false
   * @param liquidityTokenAmount Type: uint256, Indexed: false
   * @param liquidityEthAmount Type: uint256, Indexed: false
   * @param useProtocolFee Type: bool, Indexed: false
   * @param vestingEnabled Type: bool, Indexed: false
   */
  deployTokenWithLiquidity(
    tokenData: TokenDataRequest,
    proofData: ProofDataRequest,
    liquidityTokenAmount: BigNumberish,
    liquidityEthAmount: BigNumberish,
    useProtocolFee: boolean,
    vestingEnabled: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes32, Indexed: false
   */
  deployedTokens(
    parameter0: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param nullifierHash Type: bytes32, Indexed: false
   */
  getDeployedToken(
    nullifierHash: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param index Type: uint256, Indexed: false
   */
  getTornadoInstance(
    index: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GetTornadoInstanceResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  governance(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  governanceFee(overrides?: ContractCallOverrides): Promise<number>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  instanceCount(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  metadataVerifier(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes32, Indexed: false
   */
  nullifierHashUsed(
    parameter0: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param token Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  recoverERC20(
    token: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  recoverETH(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  tokenTemplate(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  tornadoInstances(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<TornadoInstancesResponse>;
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
  uniswapHandler(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newGovernance Type: address, Indexed: false
   */
  updateGovernance(
    _newGovernance: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newFee Type: uint32, Indexed: false
   */
  updateGovernanceFee(
    _newFee: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newVerifier Type: address, Indexed: false
   */
  updateMetadataVerifier(
    _newVerifier: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newHandler Type: address, Indexed: false
   */
  updateUniswapHandler(
    _newHandler: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
