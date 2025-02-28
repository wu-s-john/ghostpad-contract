/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export declare namespace GhostPad {
  export type TokenDataStruct = {
    name: string;
    symbol: string;
    initialSupply: BigNumberish;
    description: string;
    burnEnabled: boolean;
    liquidityLockPeriod: BigNumberish;
    liquidityTokenAmount: BigNumberish;
    useProtocolFee: boolean;
    vestingEnabled: boolean;
  };

  export type TokenDataStructOutput = [
    name: string,
    symbol: string,
    initialSupply: bigint,
    description: string,
    burnEnabled: boolean,
    liquidityLockPeriod: bigint,
    liquidityTokenAmount: bigint,
    useProtocolFee: boolean,
    vestingEnabled: boolean
  ] & {
    name: string;
    symbol: string;
    initialSupply: bigint;
    description: string;
    burnEnabled: boolean;
    liquidityLockPeriod: bigint;
    liquidityTokenAmount: bigint;
    useProtocolFee: boolean;
    vestingEnabled: boolean;
  };

  export type ProofDataStruct = {
    instanceIndex: BigNumberish;
    proof: BytesLike;
    root: BytesLike;
    nullifierHash: BytesLike;
    recipient: AddressLike;
    relayer: AddressLike;
    fee: BigNumberish;
    refund: BigNumberish;
  };

  export type ProofDataStructOutput = [
    instanceIndex: bigint,
    proof: string,
    root: string,
    nullifierHash: string,
    recipient: string,
    relayer: string,
    fee: bigint,
    refund: bigint
  ] & {
    instanceIndex: bigint;
    proof: string;
    root: string;
    nullifierHash: string;
    recipient: string;
    relayer: string;
    fee: bigint;
    refund: bigint;
  };
}

export interface GhostPadInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "MAX_GOVERNANCE_FEE"
      | "deployToken"
      | "deployTokenWithLiquidity"
      | "deployedTokens"
      | "getDeployedToken"
      | "getTornadoInstance"
      | "governance"
      | "governanceFee"
      | "instanceCount"
      | "nullifierHashUsed"
      | "owner"
      | "recoverERC20"
      | "recoverETH"
      | "renounceOwnership"
      | "tokenTemplate"
      | "tornadoInstances"
      | "transferOwnership"
      | "uniswapHandler"
      | "updateGovernance"
      | "updateGovernanceFee"
      | "updateUniswapHandler"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "GovernanceFeeUpdated"
      | "GovernanceUpdated"
      | "LiquidityPoolCreated"
      | "OwnershipTransferred"
      | "TokenDeployed"
      | "UniswapHandlerUpdated"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "MAX_GOVERNANCE_FEE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "deployToken",
    values: [GhostPad.TokenDataStruct, GhostPad.ProofDataStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "deployTokenWithLiquidity",
    values: [GhostPad.TokenDataStruct, GhostPad.ProofDataStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "deployedTokens",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getDeployedToken",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getTornadoInstance",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "governance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "governanceFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "instanceCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "nullifierHashUsed",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "recoverERC20",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "recoverETH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tokenTemplate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tornadoInstances",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "uniswapHandler",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "updateGovernance",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateGovernanceFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updateUniswapHandler",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "MAX_GOVERNANCE_FEE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deployToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deployTokenWithLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deployedTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDeployedToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTornadoInstance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "governance", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "governanceFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "instanceCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nullifierHashUsed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "recoverERC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "recoverETH", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenTemplate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tornadoInstances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "uniswapHandler",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateGovernance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateGovernanceFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateUniswapHandler",
    data: BytesLike
  ): Result;
}

export namespace GovernanceFeeUpdatedEvent {
  export type InputTuple = [oldFee: BigNumberish, newFee: BigNumberish];
  export type OutputTuple = [oldFee: bigint, newFee: bigint];
  export interface OutputObject {
    oldFee: bigint;
    newFee: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace GovernanceUpdatedEvent {
  export type InputTuple = [
    oldGovernance: AddressLike,
    newGovernance: AddressLike
  ];
  export type OutputTuple = [oldGovernance: string, newGovernance: string];
  export interface OutputObject {
    oldGovernance: string;
    newGovernance: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace LiquidityPoolCreatedEvent {
  export type InputTuple = [
    tokenAddress: AddressLike,
    pairAddress: AddressLike,
    liquidityAdded: BigNumberish
  ];
  export type OutputTuple = [
    tokenAddress: string,
    pairAddress: string,
    liquidityAdded: bigint
  ];
  export interface OutputObject {
    tokenAddress: string;
    pairAddress: string;
    liquidityAdded: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TokenDeployedEvent {
  export type InputTuple = [
    nullifierHash: BytesLike,
    tokenAddress: AddressLike,
    name: string,
    symbol: string
  ];
  export type OutputTuple = [
    nullifierHash: string,
    tokenAddress: string,
    name: string,
    symbol: string
  ];
  export interface OutputObject {
    nullifierHash: string;
    tokenAddress: string;
    name: string;
    symbol: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UniswapHandlerUpdatedEvent {
  export type InputTuple = [oldHandler: AddressLike, newHandler: AddressLike];
  export type OutputTuple = [oldHandler: string, newHandler: string];
  export interface OutputObject {
    oldHandler: string;
    newHandler: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface GhostPad extends BaseContract {
  connect(runner?: ContractRunner | null): GhostPad;
  waitForDeployment(): Promise<this>;

  interface: GhostPadInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  MAX_GOVERNANCE_FEE: TypedContractMethod<[], [bigint], "view">;

  deployToken: TypedContractMethod<
    [tokenData: GhostPad.TokenDataStruct, proofData: GhostPad.ProofDataStruct],
    [string],
    "nonpayable"
  >;

  deployTokenWithLiquidity: TypedContractMethod<
    [tokenData: GhostPad.TokenDataStruct, proofData: GhostPad.ProofDataStruct],
    [string],
    "payable"
  >;

  deployedTokens: TypedContractMethod<[arg0: BytesLike], [string], "view">;

  getDeployedToken: TypedContractMethod<
    [nullifierHash: BytesLike],
    [string],
    "view"
  >;

  getTornadoInstance: TypedContractMethod<
    [index: BigNumberish],
    [[string, bigint] & { instance: string; denomination: bigint }],
    "view"
  >;

  governance: TypedContractMethod<[], [string], "view">;

  governanceFee: TypedContractMethod<[], [bigint], "view">;

  instanceCount: TypedContractMethod<[], [bigint], "view">;

  nullifierHashUsed: TypedContractMethod<[arg0: BytesLike], [boolean], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  recoverERC20: TypedContractMethod<
    [token: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  recoverETH: TypedContractMethod<[], [void], "nonpayable">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  tokenTemplate: TypedContractMethod<[], [string], "view">;

  tornadoInstances: TypedContractMethod<
    [arg0: BigNumberish],
    [[string, bigint] & { instance: string; denomination: bigint }],
    "view"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  uniswapHandler: TypedContractMethod<[], [string], "view">;

  updateGovernance: TypedContractMethod<
    [_newGovernance: AddressLike],
    [void],
    "nonpayable"
  >;

  updateGovernanceFee: TypedContractMethod<
    [_newFee: BigNumberish],
    [void],
    "nonpayable"
  >;

  updateUniswapHandler: TypedContractMethod<
    [_newHandler: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "MAX_GOVERNANCE_FEE"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "deployToken"
  ): TypedContractMethod<
    [tokenData: GhostPad.TokenDataStruct, proofData: GhostPad.ProofDataStruct],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deployTokenWithLiquidity"
  ): TypedContractMethod<
    [tokenData: GhostPad.TokenDataStruct, proofData: GhostPad.ProofDataStruct],
    [string],
    "payable"
  >;
  getFunction(
    nameOrSignature: "deployedTokens"
  ): TypedContractMethod<[arg0: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getDeployedToken"
  ): TypedContractMethod<[nullifierHash: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getTornadoInstance"
  ): TypedContractMethod<
    [index: BigNumberish],
    [[string, bigint] & { instance: string; denomination: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "governance"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "governanceFee"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "instanceCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "nullifierHashUsed"
  ): TypedContractMethod<[arg0: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "recoverERC20"
  ): TypedContractMethod<
    [token: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "recoverETH"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "tokenTemplate"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "tornadoInstances"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [[string, bigint] & { instance: string; denomination: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "uniswapHandler"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "updateGovernance"
  ): TypedContractMethod<[_newGovernance: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateGovernanceFee"
  ): TypedContractMethod<[_newFee: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateUniswapHandler"
  ): TypedContractMethod<[_newHandler: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "GovernanceFeeUpdated"
  ): TypedContractEvent<
    GovernanceFeeUpdatedEvent.InputTuple,
    GovernanceFeeUpdatedEvent.OutputTuple,
    GovernanceFeeUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "GovernanceUpdated"
  ): TypedContractEvent<
    GovernanceUpdatedEvent.InputTuple,
    GovernanceUpdatedEvent.OutputTuple,
    GovernanceUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "LiquidityPoolCreated"
  ): TypedContractEvent<
    LiquidityPoolCreatedEvent.InputTuple,
    LiquidityPoolCreatedEvent.OutputTuple,
    LiquidityPoolCreatedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "TokenDeployed"
  ): TypedContractEvent<
    TokenDeployedEvent.InputTuple,
    TokenDeployedEvent.OutputTuple,
    TokenDeployedEvent.OutputObject
  >;
  getEvent(
    key: "UniswapHandlerUpdated"
  ): TypedContractEvent<
    UniswapHandlerUpdatedEvent.InputTuple,
    UniswapHandlerUpdatedEvent.OutputTuple,
    UniswapHandlerUpdatedEvent.OutputObject
  >;

  filters: {
    "GovernanceFeeUpdated(uint32,uint32)": TypedContractEvent<
      GovernanceFeeUpdatedEvent.InputTuple,
      GovernanceFeeUpdatedEvent.OutputTuple,
      GovernanceFeeUpdatedEvent.OutputObject
    >;
    GovernanceFeeUpdated: TypedContractEvent<
      GovernanceFeeUpdatedEvent.InputTuple,
      GovernanceFeeUpdatedEvent.OutputTuple,
      GovernanceFeeUpdatedEvent.OutputObject
    >;

    "GovernanceUpdated(address,address)": TypedContractEvent<
      GovernanceUpdatedEvent.InputTuple,
      GovernanceUpdatedEvent.OutputTuple,
      GovernanceUpdatedEvent.OutputObject
    >;
    GovernanceUpdated: TypedContractEvent<
      GovernanceUpdatedEvent.InputTuple,
      GovernanceUpdatedEvent.OutputTuple,
      GovernanceUpdatedEvent.OutputObject
    >;

    "LiquidityPoolCreated(address,address,uint256)": TypedContractEvent<
      LiquidityPoolCreatedEvent.InputTuple,
      LiquidityPoolCreatedEvent.OutputTuple,
      LiquidityPoolCreatedEvent.OutputObject
    >;
    LiquidityPoolCreated: TypedContractEvent<
      LiquidityPoolCreatedEvent.InputTuple,
      LiquidityPoolCreatedEvent.OutputTuple,
      LiquidityPoolCreatedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "TokenDeployed(bytes32,address,string,string)": TypedContractEvent<
      TokenDeployedEvent.InputTuple,
      TokenDeployedEvent.OutputTuple,
      TokenDeployedEvent.OutputObject
    >;
    TokenDeployed: TypedContractEvent<
      TokenDeployedEvent.InputTuple,
      TokenDeployedEvent.OutputTuple,
      TokenDeployedEvent.OutputObject
    >;

    "UniswapHandlerUpdated(address,address)": TypedContractEvent<
      UniswapHandlerUpdatedEvent.InputTuple,
      UniswapHandlerUpdatedEvent.OutputTuple,
      UniswapHandlerUpdatedEvent.OutputObject
    >;
    UniswapHandlerUpdated: TypedContractEvent<
      UniswapHandlerUpdatedEvent.InputTuple,
      UniswapHandlerUpdatedEvent.OutputTuple,
      UniswapHandlerUpdatedEvent.OutputObject
    >;
  };
}
