/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  MockUniswapHandler,
  MockUniswapHandlerInterface,
} from "../MockUniswapHandler";

const _abi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_uniswapRouterAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "_uniswapFactoryAddress",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "receive",
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "addLiquidity",
    inputs: [
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "ethAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "lockPeriod",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "createPair",
    inputs: [
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getLiquidityInfo",
    inputs: [
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "pair",
        type: "address",
        internalType: "address",
      },
      {
        name: "isLocked",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "unlockTime",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "lpBalance",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMockLPTokensTransferred",
    inputs: [
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isMockLiquidityLocked",
    inputs: [
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "liquidityInfo",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "pair",
        type: "address",
        internalType: "address",
      },
      {
        name: "isLocked",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "unlockTime",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mockAddLiquidityResult",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mockLPTokensTransferred",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mockLiquidityLocked",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMockAddLiquidityResult",
    inputs: [
      {
        name: "result",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMockLiquidityLocked",
    inputs: [
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "isLocked",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferLPTokens",
    inputs: [
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "uniswapFactoryAddress",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "uniswapRouterAddress",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "LiquidityAdded",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "pair",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amountToken",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "amountETH",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "liquidity",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LiquidityLocked",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "pair",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "lockPeriod",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "unlockTime",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
] as const;

const _bytecode =
  "0x60c06040526004805460ff1916905534801561001a57600080fd5b50604051610f4e380380610f4e8339818101604052604081101561003d57600080fd5b50805160209091015160006100506100b8565b600080546001600160a01b0319166001600160a01b0383169081178255604051929350917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a3506001600160601b0319606092831b8116608052911b1660a0526100bc565b3390565b60805160601c60a05160601c610e696100e5600039806107315250806107045250610e696000f3fe6080604052600436106101025760003560e01c80637c0f845611610095578063cac9996011610064578063cac999601461034e578063cb7f43fe14610381578063d27db03a146103dc578063f2fde38b1461040f578063fc82fca81461044257610109565b80637c0f8456146102775780638da5cb5b146102da5780639ccb0744146102ef578063c10dbc2b1461032257610109565b806344cefe85116100d157806344cefe85146101c75780636c77510a146101fa578063715018a61461022d57806373293f631461024457610109565b80631ece366a1461010e57806320ca3c7f146101585780632cb7d635146101895780633655ac3c146101b257610109565b3661010957005b600080fd5b6101466004803603608081101561012457600080fd5b506001600160a01b03813516906020810135906040810135906060013561047d565b60408051918252519081900360200190f35b34801561016457600080fd5b5061016d610702565b604080516001600160a01b039092168252519081900360200190f35b34801561019557600080fd5b5061019e610726565b604080519115158252519081900360200190f35b3480156101be57600080fd5b5061016d61072f565b3480156101d357600080fd5b5061019e600480360360208110156101ea57600080fd5b50356001600160a01b0316610753565b34801561020657600080fd5b5061019e6004803603602081101561021d57600080fd5b50356001600160a01b0316610768565b34801561023957600080fd5b5061024261077d565b005b34801561025057600080fd5b5061019e6004803603602081101561026757600080fd5b50356001600160a01b0316610829565b34801561028357600080fd5b506102aa6004803603602081101561029a57600080fd5b50356001600160a01b0316610847565b604080516001600160a01b0390951685529215156020850152838301919091526060830152519081900360800190f35b3480156102e657600080fd5b5061016d610897565b3480156102fb57600080fd5b5061016d6004803603602081101561031257600080fd5b50356001600160a01b03166108a6565b34801561032e57600080fd5b506102426004803603602081101561034557600080fd5b5035151561091c565b34801561035a57600080fd5b506102426004803603602081101561037157600080fd5b50356001600160a01b0316610991565b34801561038d57600080fd5b506103b4600480360360208110156103a457600080fd5b50356001600160a01b0316610ae9565b604080516001600160a01b039094168452911515602084015282820152519081900360600190f35b3480156103e857600080fd5b5061019e600480360360208110156103ff57600080fd5b50356001600160a01b0316610b18565b34801561041b57600080fd5b506102426004803603602081101561043257600080fd5b50356001600160a01b0316610b36565b34801561044e57600080fd5b506102426004803603604081101561046557600080fd5b506001600160a01b0381351690602001351515610c38565b60006001600160a01b0385166104da576040805162461bcd60e51b815260206004820152601c60248201527f546f6b656e20616464726573732063616e6e6f74206265207a65726f00000000604482015290519081900360640190fd5b600084116105195760405162461bcd60e51b8152600401808060200182810382526023815260200180610df16023913960400191505060405180910390fd5b82341461056d576040805162461bcd60e51b815260206004820152601d60248201527f53656e7420455448206d757374206d6174636820657468416d6f756e74000000604482015290519081900360640190fd5b6001600160a01b03808616600090815260016020526040902054168061059957610596866108a6565b90505b60006105a6866002610cfe565b90506040518060600160405280836001600160a01b031681526020016000861115158152602001600086116105dc5760006105e6565b6105e64287610d65565b90526001600160a01b03808916600081815260016020818152604080842087518154898501511515600160a01b0260ff60a01b19928a166001600160a01b031990921691909117919091161781559681015196909201959095556002855290819020805460ff191689151517905580518a8152938401899052838101859052519185169290917f4a1a2a6176e9646d9e3157f7c2ab3c499f18337c0b0828cfb28e0a61de4a11f79181900360600190a383156106f8576001600160a01b03878116600081815260016020818152604092839020909101548251898152918201528151938616937f59d86badba9ed0836e2f7433321f97c74d9825a883e2315b54e1a86177795486929181900390910190a35b9695505050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b60045460ff1681565b7f000000000000000000000000000000000000000000000000000000000000000081565b60026020526000908152604090205460ff1681565b60036020526000908152604090205460ff1681565b610785610dc6565b6001600160a01b0316610796610897565b6001600160a01b0316146107df576040805162461bcd60e51b81526020600482018190526024820152600080516020610e14833981519152604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b6001600160a01b031660009081526003602052604090205460ff1690565b6001600160a01b038181166000908152600160208190526040822080549181015493821693600160a01b90920460ff16929084610885576000610889565b6103e85b61ffff169150509193509193565b6000546001600160a01b031690565b60408051606083901b6bffffffffffffffffffffffff19166020808301919091524260348084019190915283518084039091018152605490920183528151918101919091206001600160a01b039384166000908152600190925291902080546001600160a01b0319169282169290921790915590565b610924610dc6565b6001600160a01b0316610935610897565b6001600160a01b03161461097e576040805162461bcd60e51b81526020600482018190526024820152600080516020610e14833981519152604482015290519081900360640190fd5b6004805460ff1916911515919091179055565b610999610dc6565b6001600160a01b03166109aa610897565b6001600160a01b0316146109f3576040805162461bcd60e51b81526020600482018190526024820152600080516020610e14833981519152604482015290519081900360640190fd5b6001600160a01b0380821660009081526001602052604090208054909116610a57576040805162461bcd60e51b815260206004820152601260248201527114185a5c88191bd95cdb89dd08195e1a5cdd60721b604482015290519081900360640190fd5b8054600160a01b900460ff161580610a73575080600101544210155b610ac4576040805162461bcd60e51b815260206004820152601960248201527f4c6971756964697479206973207374696c6c206c6f636b656400000000000000604482015290519081900360640190fd5b506001600160a01b03166000908152600360205260409020805460ff19166001179055565b600160208190526000918252604090912080549101546001600160a01b03821691600160a01b900460ff169083565b6001600160a01b031660009081526002602052604090205460ff1690565b610b3e610dc6565b6001600160a01b0316610b4f610897565b6001600160a01b031614610b98576040805162461bcd60e51b81526020600482018190526024820152600080516020610e14833981519152604482015290519081900360640190fd5b6001600160a01b038116610bdd5760405162461bcd60e51b8152600401808060200182810382526026815260200180610dcb6026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b610c40610dc6565b6001600160a01b0316610c51610897565b6001600160a01b031614610c9a576040805162461bcd60e51b81526020600482018190526024820152600080516020610e14833981519152604482015290519081900360640190fd5b6001600160a01b0382166000908152600260209081526040808320805460ff19168515159081179091556001909252909120805460ff60a01b1916600160a01b90920291909117815581610cef576000610cf4565b426064015b6001909101555050565b6000808211610d54576040805162461bcd60e51b815260206004820152601a60248201527f536166654d6174683a206469766973696f6e206279207a65726f000000000000604482015290519081900360640190fd5b818381610d5d57fe5b049392505050565b600082820183811015610dbf576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b339056fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f2061646472657373546f6b656e20616d6f756e74206d7573742062652067726561746572207468616e20304f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572a2646970667358221220e6325ae704f72f095d41f824a15c1ad7cd18dc4019479d77be77a972be0f3ded64736f6c63430007060033";

type MockUniswapHandlerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockUniswapHandlerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockUniswapHandler__factory extends ContractFactory {
  constructor(...args: MockUniswapHandlerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _uniswapRouterAddress: AddressLike,
    _uniswapFactoryAddress: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _uniswapRouterAddress,
      _uniswapFactoryAddress,
      overrides || {}
    );
  }
  override deploy(
    _uniswapRouterAddress: AddressLike,
    _uniswapFactoryAddress: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _uniswapRouterAddress,
      _uniswapFactoryAddress,
      overrides || {}
    ) as Promise<
      MockUniswapHandler & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MockUniswapHandler__factory {
    return super.connect(runner) as MockUniswapHandler__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockUniswapHandlerInterface {
    return new Interface(_abi) as MockUniswapHandlerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): MockUniswapHandler {
    return new Contract(address, _abi, runner) as unknown as MockUniswapHandler;
  }
}
