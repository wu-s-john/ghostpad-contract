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
  Ghostpad,
  GhostpadMethodNames,
  GhostpadEventsContext,
  GhostpadEvents
>;
export type GhostpadEvents =
  | 'GovernanceFeeUpdated'
  | 'GovernanceUpdated'
  | 'LiquidityPoolCreated'
  | 'MetadataVerifierUpdated'
  | 'OwnershipTransferred'
  | 'TokenDeployed'
  | 'UniswapHandlerUpdated';
export interface GhostpadEventsContext {
  GovernanceFeeUpdated(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  GovernanceUpdated(
    parameters: {
      filter?: {
        oldGovernance?: string | string[];
        newGovernance?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  LiquidityPoolCreated(
    parameters: {
      filter?: {
        tokenAddress?: string | string[];
        pairAddress?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  MetadataVerifierUpdated(
    parameters: {
      filter?: {
        oldVerifier?: string | string[];
        newVerifier?: string | string[];
      };
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
  TokenDeployed(
    parameters: {
      filter?: { nullifierHash?: string | number[] | string | number[][] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  UniswapHandlerUpdated(
    parameters: {
      filter?: {
        oldHandler?: string | string[];
        newHandler?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
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
  initialSupply: string;
  description: string;
  taxRate: string;
  taxRecipient: string;
  burnEnabled: boolean;
  liquidityLockPeriod: string;
}
export interface ProofDataRequest {
  instanceIndex: string;
  proof: string | number[];
  root: string | number[];
  nullifierHash: string | number[];
  recipient: string;
  relayer: string;
  fee: string;
  refund: string;
  metadataProof: string | number[];
  metadataHash: string | number[];
}
export interface GetTornadoInstanceResponse {
  instance: string;
  denomination: string;
}
export interface TornadoInstancesResponse {
  instance: string;
  denomination: string;
}
export interface GovernanceFeeUpdatedEventEmittedResponse {
  oldFee: string | number;
  newFee: string | number;
}
export interface GovernanceUpdatedEventEmittedResponse {
  oldGovernance: string;
  newGovernance: string;
}
export interface LiquidityPoolCreatedEventEmittedResponse {
  tokenAddress: string;
  pairAddress: string;
  liquidityAdded: string;
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
  nullifierHash: string | number[];
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
    _uniswapHandler: string
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  MAX_GOVERNANCE_FEE(): MethodConstantReturnContext<string>;
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
    vestingEnabled: boolean
  ): MethodReturnContext;
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
    liquidityTokenAmount: string,
    liquidityEthAmount: string,
    useProtocolFee: boolean,
    vestingEnabled: boolean
  ): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes32, Indexed: false
   */
  deployedTokens(
    parameter0: string | number[]
  ): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param nullifierHash Type: bytes32, Indexed: false
   */
  getDeployedToken(
    nullifierHash: string | number[]
  ): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param index Type: uint256, Indexed: false
   */
  getTornadoInstance(
    index: string
  ): MethodConstantReturnContext<GetTornadoInstanceResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  governance(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  governanceFee(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  instanceCount(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  metadataVerifier(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes32, Indexed: false
   */
  nullifierHashUsed(
    parameter0: string | number[]
  ): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param token Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  recoverERC20(token: string, amount: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  recoverETH(): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  tokenTemplate(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  tornadoInstances(
    parameter0: string
  ): MethodConstantReturnContext<TornadoInstancesResponse>;
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
  uniswapHandler(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newGovernance Type: address, Indexed: false
   */
  updateGovernance(_newGovernance: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newFee Type: uint32, Indexed: false
   */
  updateGovernanceFee(_newFee: string | number): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newVerifier Type: address, Indexed: false
   */
  updateMetadataVerifier(_newVerifier: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newHandler Type: address, Indexed: false
   */
  updateUniswapHandler(_newHandler: string): MethodReturnContext;
}
