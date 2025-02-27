import { ContractTransaction } from 'ethers';
import { Arrayish, BigNumber, BigNumberish, Interface } from 'ethers/utils';
import { EthersContractContext } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContext<
  TokenTemplate,
  TokenTemplateEventsContext,
  TokenTemplateEvents
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
  Approval(...parameters: any): EventFilter;
  BurnEnabledUpdated(...parameters: any): EventFilter;
  ContractLocked(...parameters: any): EventFilter;
  DescriptionUpdated(...parameters: any): EventFilter;
  Initialized(...parameters: any): EventFilter;
  LiquidityLocked(...parameters: any): EventFilter;
  LiquidityUnlocked(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  TaxRateUpdated(...parameters: any): EventFilter;
  TaxRecipientUpdated(...parameters: any): EventFilter;
  Transfer(...parameters: any): EventFilter;
  VestingReleased(...parameters: any): EventFilter;
  VestingScheduleCreated(...parameters: any): EventFilter;
  VestingScheduleRevoked(...parameters: any): EventFilter;
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
  0: string;
  cliff: BigNumber;
  1: BigNumber;
  start: BigNumber;
  2: BigNumber;
  duration: BigNumber;
  3: BigNumber;
  releasedAmount: BigNumber;
  4: BigNumber;
  amountTotal: BigNumber;
  5: BigNumber;
  revocable: boolean;
  6: boolean;
  revoked: boolean;
  7: boolean;
}
export interface ApprovalEventEmittedResponse {
  owner: string;
  spender: string;
  value: BigNumberish;
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
  initialSupply: BigNumberish;
  owner: string;
}
export interface LiquidityLockedEventEmittedResponse {
  liquidityPool: string;
  unlockTime: BigNumberish;
}
export interface LiquidityUnlockedEventEmittedResponse {
  liquidityPool: string;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface TaxRateUpdatedEventEmittedResponse {
  oldRate: BigNumberish;
  newRate: BigNumberish;
}
export interface TaxRecipientUpdatedEventEmittedResponse {
  oldRecipient: string;
  newRecipient: string;
}
export interface TransferEventEmittedResponse {
  from: string;
  to: string;
  value: BigNumberish;
}
export interface VestingReleasedEventEmittedResponse {
  vestingScheduleId: Arrayish;
  amount: BigNumberish;
}
export interface VestingScheduleCreatedEventEmittedResponse {
  beneficiary: string;
  amount: BigNumberish;
  start: BigNumberish;
  cliff: BigNumberish;
  duration: BigNumberish;
  revocable: boolean;
}
export interface VestingScheduleRevokedEventEmittedResponse {
  vestingScheduleId: Arrayish;
}
export interface TokenTemplate {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   */
  'new'(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
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
    spender: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   */
  balanceOf(
    account: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param amount Type: uint256, Indexed: false
   */
  burn(
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  burnEnabled(overrides?: ContractCallOverrides): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param account Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  burnFrom(
    account: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param vestingScheduleId Type: bytes32, Indexed: false
   */
  computeReleasableAmount(
    vestingScheduleId: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
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
    index: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  contractLocked(overrides?: ContractCallOverrides): Promise<boolean>;
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
    _start: BigNumberish,
    _cliff: BigNumberish,
    _duration: BigNumberish,
    _revocable: boolean,
    _amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  decimals(overrides?: ContractCallOverrides): Promise<number>;
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
    subtractedValue: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  description(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param vestingScheduleId Type: bytes32, Indexed: false
   */
  getVestingSchedule(
    vestingScheduleId: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<VestingscheduleResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getVestingSchedulesCount(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getVestingSchedulesTotalAmount(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param addedValue Type: uint256, Indexed: false
   */
  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
    initialSupply: BigNumberish,
    owner: string,
    _description: string,
    _taxRate: BigNumberish,
    _taxRecipient: string,
    _burnEnabled: boolean,
    _liquidityLockPeriod: BigNumberish,
    _vestingEnabled: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  liquidityLockEndTime(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  liquidityLockPeriod(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  liquidityPool(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  lockContract(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _liquidityPool Type: address, Indexed: false
   */
  lockLiquidity(
    _liquidityPool: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param to Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  mint(
    to: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  name(overrides?: ContractCallOverrides): Promise<string>;
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
   * @param vestingScheduleId Type: bytes32, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  release(
    vestingScheduleId: Arrayish,
    amount: BigNumberish,
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param vestingScheduleId Type: bytes32, Indexed: false
   */
  revoke(
    vestingScheduleId: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param enabled Type: bool, Indexed: false
   */
  setBurnEnabled(
    enabled: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  symbol(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  taxRate(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  taxRecipient(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalSupply(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param recipient Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  transfer(
    recipient: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
    amount: BigNumberish,
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  unlockLiquidity(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newDescription Type: string, Indexed: false
   */
  updateDescription(
    newDescription: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newTaxRate Type: uint256, Indexed: false
   */
  updateTaxRate(
    newTaxRate: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newTaxRecipient Type: address, Indexed: false
   */
  updateTaxRecipient(
    newTaxRecipient: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  vestingEnabled(overrides?: ContractCallOverrides): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param token Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  withdrawToken(
    token: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
