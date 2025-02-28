/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type { Hasher, HasherInterface } from "../Hasher";

const _abi = [
  {
    type: "function",
    name: "MiMCSponge",
    inputs: [
      {
        name: "in_xL",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "in_xR",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "xL",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "xR",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
] as const;

const _bytecode =
  "0x6080604052348015600f57600080fd5b5060e38061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063f47d33b514602d575b600080fd5b604d60048036036040811015604157600080fd5b50803590602001356066565b6040805192835260208301919091528051918290030190f35b60408051602080820194909452815180820385018152818301835280519085012060608083019490945282518083039094018452608090910190915281519190920120909156fea26469706673582212207aedcbed3c23f78d935a9be64dceaef7f453aafe7a3682ae1166b7d45810f51864736f6c63430007060033";

type HasherConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HasherConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Hasher__factory extends ContractFactory {
  constructor(...args: HasherConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Hasher & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Hasher__factory {
    return super.connect(runner) as Hasher__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HasherInterface {
    return new Interface(_abi) as HasherInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Hasher {
    return new Contract(address, _abi, runner) as unknown as Hasher;
  }
}
