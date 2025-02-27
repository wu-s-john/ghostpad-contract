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
  TokenTemplate,
  TokenTemplateMethodNames,
  TokenTemplateEventsContext,
  TokenTemplateEvents
>;
export type TokenTemplateEvents =
  | 'Approval'
  | 'BurnEnabledUpdated'
  | 'ContractLocked'
  | 'DescriptionUpdated'
  | 'Initialized'
  | 'LiquidityLocked'
  | 'LiquidityUnlocked'
  | 'OwnershipTransferred'
  | 'TaxRateUpdated'
  | 'TaxRecipientUpdated'
  | 'Transfer'
  | 'VestingReleased'
  | 'VestingScheduleCreated'
  | 'VestingScheduleRevoked';
export interface TokenTemplateEventsContext {
  Approval(
    parameters: {
      filter?: { owner?: string | string[]; spender?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  BurnEnabledUpdated(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  ContractLocked(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  DescriptionUpdated(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  Initialized(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  LiquidityLocked(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  LiquidityUnlocked(
    parameters: {
      filter?: {};
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
  TaxRateUpdated(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  TaxRecipientUpdated(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  Transfer(
    parameters: {
      filter?: { from?: string | string[]; to?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  VestingReleased(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  VestingScheduleCreated(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  VestingScheduleRevoked(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
}
export type TokenTemplateMethodNames =
  | 'new'
  | 'allowance'
  | 'approve'
  | 'balanceOf'
  | 'burn'
  | 'burnEnabled'
  | 'burnFrom'
  | 'computeReleasableAmount'
  | 'computeVestingScheduleIdForAddressAndIndex'
  | 'contractLocked'
  | 'createVestingSchedule'
  | 'decimals'
  | 'decreaseAllowance'
  | 'description'
  | 'getVestingSchedule'
  | 'getVestingSchedulesCount'
  | 'getVestingSchedulesTotalAmount'
  | 'increaseAllowance'
  | 'initialize'
  | 'liquidityLockEndTime'
  | 'liquidityLockPeriod'
  | 'liquidityPool'
  | 'lockContract'
  | 'lockLiquidity'
  | 'mint'
  | 'name'
  | 'owner'
  | 'release'
  | 'renounceOwnership'
  | 'revoke'
  | 'setBurnEnabled'
  | 'symbol'
  | 'taxRate'
  | 'taxRecipient'
  | 'totalSupply'
  | 'transfer'
  | 'transferFrom'
  | 'transferOwnership'
  | 'unlockLiquidity'
  | 'updateDescription'
  | 'updateTaxRate'
  | 'updateTaxRecipient'
  | 'vestingEnabled'
  | 'withdrawToken';
export interface VestingscheduleResponse {
  beneficiary: string;
  cliff: string;
  start: string;
  duration: string;
  releasedAmount: string;
  amountTotal: string;
  revocable: boolean;
  revoked: boolean;
}
export interface ApprovalEventEmittedResponse {
  owner: string;
  spender: string;
  value: string;
}
export interface BurnEnabledUpdatedEventEmittedResponse {
  enabled: boolean;
}
export interface ContractLockedEventEmittedResponse {
  locked: boolean;
}
export interface DescriptionUpdatedEventEmittedResponse {
  oldDescription: string;
  newDescription: string;
}
export interface InitializedEventEmittedResponse {
  name: string;
  symbol: string;
  initialSupply: string;
  owner: string;
}
export interface LiquidityLockedEventEmittedResponse {
  liquidityPool: string;
  unlockTime: string;
}
export interface LiquidityUnlockedEventEmittedResponse {
  liquidityPool: string;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface TaxRateUpdatedEventEmittedResponse {
  oldRate: string;
  newRate: string;
}
export interface TaxRecipientUpdatedEventEmittedResponse {
  oldRecipient: string;
  newRecipient: string;
}
export interface TransferEventEmittedResponse {
  from: string;
  to: string;
  value: string;
}
export interface VestingReleasedEventEmittedResponse {
  vestingScheduleId: string | number[];
  amount: string;
}
export interface VestingScheduleCreatedEventEmittedResponse {
  beneficiary: string;
  amount: string;
  start: string;
  cliff: string;
  duration: string;
  revocable: boolean;
}
export interface VestingScheduleRevokedEventEmittedResponse {
  vestingScheduleId: string | number[];
}
export interface TokenTemplate {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   */
  'new'(): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param owner Type: address, Indexed: false
   * @param spender Type: address, Indexed: false
   */
  allowance(
    owner: string,
    spender: string
  ): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  approve(spender: string, amount: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   */
  balanceOf(account: string): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param amount Type: uint256, Indexed: false
   */
  burn(amount: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  burnEnabled(): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param account Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  burnFrom(account: string, amount: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param vestingScheduleId Type: bytes32, Indexed: false
   */
  computeReleasableAmount(
    vestingScheduleId: string | number[]
  ): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param holder Type: address, Indexed: false
   * @param index Type: uint256, Indexed: false
   */
  computeVestingScheduleIdForAddressAndIndex(
    holder: string,
    index: string
  ): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  contractLocked(): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _beneficiary Type: address, Indexed: false
   * @param _start Type: uint256, Indexed: false
   * @param _cliff Type: uint256, Indexed: false
   * @param _duration Type: uint256, Indexed: false
   * @param _revocable Type: bool, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   */
  createVestingSchedule(
    _beneficiary: string,
    _start: string,
    _cliff: string,
    _duration: string,
    _revocable: boolean,
    _amount: string
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  decimals(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param subtractedValue Type: uint256, Indexed: false
   */
  decreaseAllowance(
    spender: string,
    subtractedValue: string
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  description(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param vestingScheduleId Type: bytes32, Indexed: false
   */
  getVestingSchedule(
    vestingScheduleId: string | number[]
  ): MethodConstantReturnContext<VestingscheduleResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getVestingSchedulesCount(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getVestingSchedulesTotalAmount(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param addedValue Type: uint256, Indexed: false
   */
  increaseAllowance(spender: string, addedValue: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param name Type: string, Indexed: false
   * @param symbol Type: string, Indexed: false
   * @param initialSupply Type: uint256, Indexed: false
   * @param owner Type: address, Indexed: false
   * @param _description Type: string, Indexed: false
   * @param _taxRate Type: uint256, Indexed: false
   * @param _taxRecipient Type: address, Indexed: false
   * @param _burnEnabled Type: bool, Indexed: false
   * @param _liquidityLockPeriod Type: uint256, Indexed: false
   * @param _vestingEnabled Type: bool, Indexed: false
   */
  initialize(
    name: string,
    symbol: string,
    initialSupply: string,
    owner: string,
    _description: string,
    _taxRate: string,
    _taxRecipient: string,
    _burnEnabled: boolean,
    _liquidityLockPeriod: string,
    _vestingEnabled: boolean
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  liquidityLockEndTime(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  liquidityLockPeriod(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  liquidityPool(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  lockContract(): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _liquidityPool Type: address, Indexed: false
   */
  lockLiquidity(_liquidityPool: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param to Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  mint(to: string, amount: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  name(): MethodConstantReturnContext<string>;
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
   * @param vestingScheduleId Type: bytes32, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  release(
    vestingScheduleId: string | number[],
    amount: string
  ): MethodReturnContext;
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
   * @param vestingScheduleId Type: bytes32, Indexed: false
   */
  revoke(vestingScheduleId: string | number[]): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param enabled Type: bool, Indexed: false
   */
  setBurnEnabled(enabled: boolean): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  symbol(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  taxRate(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  taxRecipient(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalSupply(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param recipient Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  transfer(recipient: string, amount: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param sender Type: address, Indexed: false
   * @param recipient Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  transferFrom(
    sender: string,
    recipient: string,
    amount: string
  ): MethodReturnContext;
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  unlockLiquidity(): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newDescription Type: string, Indexed: false
   */
  updateDescription(newDescription: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newTaxRate Type: uint256, Indexed: false
   */
  updateTaxRate(newTaxRate: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newTaxRecipient Type: address, Indexed: false
   */
  updateTaxRecipient(newTaxRecipient: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  vestingEnabled(): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param token Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  withdrawToken(token: string, amount: string): MethodReturnContext;
}
