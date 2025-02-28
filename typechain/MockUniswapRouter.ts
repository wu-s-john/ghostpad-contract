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
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface MockUniswapRouterInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "WETH"
      | "addLiquidityETH"
      | "calculateSwapAmount"
      | "ethReserves"
      | "factory"
      | "mockPair"
      | "setMockPair"
      | "setTokenReserves"
      | "swapExactETHForTokens"
      | "tokenReserves"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "WETH", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "addLiquidityETH",
    values: [
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      AddressLike,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateSwapAmount",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "ethReserves",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(functionFragment: "mockPair", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setMockPair",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenReserves",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "swapExactETHForTokens",
    values: [BigNumberish, AddressLike[], AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenReserves",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "WETH", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addLiquidityETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateSwapAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ethReserves",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mockPair", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setMockPair",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokenReserves",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapExactETHForTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenReserves",
    data: BytesLike
  ): Result;
}

export interface MockUniswapRouter extends BaseContract {
  connect(runner?: ContractRunner | null): MockUniswapRouter;
  waitForDeployment(): Promise<this>;

  interface: MockUniswapRouterInterface;

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

  WETH: TypedContractMethod<[], [string], "view">;

  addLiquidityETH: TypedContractMethod<
    [
      token: AddressLike,
      amountTokenDesired: BigNumberish,
      amountTokenMin: BigNumberish,
      amountETHMin: BigNumberish,
      to: AddressLike,
      deadline: BigNumberish
    ],
    [
      [bigint, bigint, bigint] & {
        amountToken: bigint;
        amountETH: bigint;
        liquidity: bigint;
      }
    ],
    "payable"
  >;

  calculateSwapAmount: TypedContractMethod<
    [ethAmount: BigNumberish, token: AddressLike],
    [bigint],
    "view"
  >;

  ethReserves: TypedContractMethod<[], [bigint], "view">;

  factory: TypedContractMethod<[], [string], "view">;

  mockPair: TypedContractMethod<[], [string], "view">;

  setMockPair: TypedContractMethod<
    [_mockPair: AddressLike],
    [void],
    "nonpayable"
  >;

  setTokenReserves: TypedContractMethod<
    [token: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  swapExactETHForTokens: TypedContractMethod<
    [
      amountOutMin: BigNumberish,
      path: AddressLike[],
      to: AddressLike,
      deadline: BigNumberish
    ],
    [bigint[]],
    "payable"
  >;

  tokenReserves: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "WETH"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "addLiquidityETH"
  ): TypedContractMethod<
    [
      token: AddressLike,
      amountTokenDesired: BigNumberish,
      amountTokenMin: BigNumberish,
      amountETHMin: BigNumberish,
      to: AddressLike,
      deadline: BigNumberish
    ],
    [
      [bigint, bigint, bigint] & {
        amountToken: bigint;
        amountETH: bigint;
        liquidity: bigint;
      }
    ],
    "payable"
  >;
  getFunction(
    nameOrSignature: "calculateSwapAmount"
  ): TypedContractMethod<
    [ethAmount: BigNumberish, token: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "ethReserves"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "factory"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "mockPair"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setMockPair"
  ): TypedContractMethod<[_mockPair: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setTokenReserves"
  ): TypedContractMethod<
    [token: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "swapExactETHForTokens"
  ): TypedContractMethod<
    [
      amountOutMin: BigNumberish,
      path: AddressLike[],
      to: AddressLike,
      deadline: BigNumberish
    ],
    [bigint[]],
    "payable"
  >;
  getFunction(
    nameOrSignature: "tokenReserves"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  filters: {};
}
