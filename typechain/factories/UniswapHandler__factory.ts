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
  UniswapHandler,
  UniswapHandlerInterface,
} from "../UniswapHandler";

const _abi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_uniswapRouterAddress",
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
        name: "liquidity",
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
        name: "pairAddress",
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
    name: "pairExists",
    inputs: [
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "exists",
        type: "bool",
        internalType: "bool",
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
    type: "function",
    name: "wethAddress",
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
  "0x60e06040523480156200001157600080fd5b50604051620018d0380380620018d0833981810160405260208110156200003757600080fd5b50516000620000456200020d565b600080546001600160a01b0319166001600160a01b0383169081178255604051929350917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a3506001600160a01b038116620000eb576040805162461bcd60e51b815260206004820152601d60248201527f526f7574657220616464726573732063616e6e6f74206265207a65726f000000604482015290519081900360640190fd5b806001600160a01b03166080816001600160a01b031660601b815250506000819050806001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b1580156200014757600080fd5b505afa1580156200015c573d6000803e3d6000fd5b505050506040513d60208110156200017357600080fd5b505160601b6001600160601b03191660a052604080516315ab88c960e31b815290516001600160a01b0383169163ad5c4648916004808301926020929190829003018186803b158015620001c657600080fd5b505afa158015620001db573d6000803e3d6000fd5b505050506040513d6020811015620001f257600080fd5b505160601b6001600160601b03191660c05250620002119050565b3390565b60805160601c60a05160601c60c05160601c6116616200026f6000398061035b52806108c85280610b225280610be252508061032b52806108a45280610b4c525080610511528061055b52806105c9528061088052506116616000f3fe6080604052600436106100ab5760003560e01c80637c0f8456116100645780637c0f8456146101ba5780638da5cb5b1461021d5780639ccb074414610232578063cac9996014610265578063cb7f43fe14610298578063f2fde38b146102f3576100b2565b80631a56f648146100b75780631ece366a146100fe57806320ca3c7f146101485780633655ac3c146101795780634f0e0ef31461018e578063715018a6146101a3576100b2565b366100b257005b600080fd5b3480156100c357600080fd5b506100ea600480360360208110156100da57600080fd5b50356001600160a01b0316610326565b604080519115158252519081900360200190f35b6101366004803603608081101561011457600080fd5b506001600160a01b038135169060208101359060408101359060600135610405565b60408051918252519081900360200190f35b34801561015457600080fd5b5061015d61087e565b604080516001600160a01b039092168252519081900360200190f35b34801561018557600080fd5b5061015d6108a2565b34801561019a57600080fd5b5061015d6108c6565b3480156101af57600080fd5b506101b86108ea565b005b3480156101c657600080fd5b506101ed600480360360208110156101dd57600080fd5b50356001600160a01b03166109a8565b604080516001600160a01b0390951685529215156020850152838301919091526060830152519081900360800190f35b34801561022957600080fd5b5061015d610a96565b34801561023e57600080fd5b5061015d6004803603602081101561025557600080fd5b50356001600160a01b0316610aa5565b34801561027157600080fd5b506101b86004803603602081101561028857600080fd5b50356001600160a01b0316610c85565b3480156102a457600080fd5b506102cb600480360360208110156102bb57600080fd5b50356001600160a01b0316610ec0565b604080516001600160a01b039094168452911515602084015282820152519081900360600190f35b3480156102ff57600080fd5b506101b86004803603602081101561031657600080fd5b50356001600160a01b0316610eef565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663e6a43905847f00000000000000000000000000000000000000000000000000000000000000006040518363ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b031681526020019250505060206040518083038186803b1580156103c757600080fd5b505afa1580156103db573d6000803e3d6000fd5b505050506040513d60208110156103f157600080fd5b50516001600160a01b031615159392505050565b60006001600160a01b038516610462576040805162461bcd60e51b815260206004820152601c60248201527f546f6b656e20616464726573732063616e6e6f74206265207a65726f00000000604482015290519081900360640190fd5b600084116104a15760405162461bcd60e51b81526004018080602001828103825260238152602001806115a96023913960400191505060405180910390fd5b8234146104f5576040805162461bcd60e51b815260206004820152601d60248201527f53656e7420455448206d757374206d6174636820657468416d6f756e74000000604482015290519081900360640190fd5b600061050086610aa5565b90506105376001600160a01b0387167f00000000000000000000000000000000000000000000000000000000000000006000611003565b61054c6001600160a01b03871633308861111b565b6105806001600160a01b0387167f000000000000000000000000000000000000000000000000000000000000000087611003565b6040805163f305d71960e01b81526001600160a01b0388811660048301526024820188905260006044830181905260648301819052306084840152610708420160a484015292517f00000000000000000000000000000000000000000000000000000000000000009392839283929086169163f305d719918b9160c48082019260609290919082900301818588803b15801561061b57600080fd5b505af115801561062f573d6000803e3d6000fd5b50505050506040513d606081101561064657600080fd5b508051602082015160409092015190945090925090508883101561068357610683336106728b8661117b565b6001600160a01b038d1691906111d8565b878210156106c357336108fc6106998a8561117b565b6040518115909202916000818181858888f193505050501580156106c1573d6000803e3d6000fd5b505b6040518060600160405280866001600160a01b031681526020016000891115158152602001600089116106f7576000610701565b610701428a61122a565b90526001600160a01b038b811660009081526001602081815260409283902085518154928701516001600160a01b031990931695169490941760ff60a01b1916600160a01b91151591909102178355920151910155861561082157896001600160a01b03166386b6dd08866040518263ffffffff1660e01b815260040180826001600160a01b03168152602001915050600060405180830381600087803b1580156107ab57600080fd5b505af19250505080156107bc575060015b6107c557610821565b6001600160a01b038a81166000818152600160208181526040928390209091015482518c8152918201528151938916937f59d86badba9ed0836e2f7433321f97c74d9825a883e2315b54e1a86177795486929181900390910190a35b604080518481526020810184905280820183905290516001600160a01b0380881692908d16917f4a1a2a6176e9646d9e3157f7c2ab3c499f18337c0b0828cfb28e0a61de4a11f79181900360600190a39998505050505050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b6108f261128b565b6001600160a01b0316610903610a96565b6001600160a01b03161461095e576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b6001600160a01b038181166000908152600160208190526040822080549181015493821693600160a01b90920460ff169290731234567890123456789012345678901234567890851415610a0157620f42409150610a8e565b6001600160a01b03851615610a8957604080516370a0823160e01b815230600482015290516001600160a01b038716916370a08231916024808301926020929190829003018186803b158015610a5657600080fd5b505afa158015610a6a573d6000803e3d6000fd5b505050506040513d6020811015610a8057600080fd5b50519150610a8e565b600091505b509193509193565b6000546001600160a01b031690565b60006001600160a01b038216610b02576040805162461bcd60e51b815260206004820152601c60248201527f546f6b656e20616464726573732063616e6e6f74206265207a65726f00000000604482015290519081900360640190fd5b6040805163e6a4390560e01b81526001600160a01b0384811660048301527f00000000000000000000000000000000000000000000000000000000000000008116602483015291517f00000000000000000000000000000000000000000000000000000000000000009283169163e6a43905916044808301926020929190829003018186803b158015610b9457600080fd5b505afa158015610ba8573d6000803e3d6000fd5b505050506040513d6020811015610bbe57600080fd5b505191506001600160a01b038216610c7f57806001600160a01b031663c9c65396847f00000000000000000000000000000000000000000000000000000000000000006040518363ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b0316815260200192505050602060405180830381600087803b158015610c5057600080fd5b505af1158015610c64573d6000803e3d6000fd5b505050506040513d6020811015610c7a57600080fd5b505191505b50919050565b610c8d61128b565b6001600160a01b0316610c9e610a96565b6001600160a01b031614610cf9576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6001600160a01b0380821660009081526001602052604090208054909116610d5d576040805162461bcd60e51b815260206004820152601260248201527114185a5c88191bd95cdb89dd08195e1a5cdd60721b604482015290519081900360640190fd5b8054600160a01b900460ff161580610d79575080600101544210155b610dca576040805162461bcd60e51b815260206004820152601960248201527f4c6971756964697479206973207374696c6c206c6f636b656400000000000000604482015290519081900360640190fd5b8054604080516370a0823160e01b815230600482015290516000926001600160a01b0316916370a08231916024808301926020929190829003018186803b158015610e1457600080fd5b505afa158015610e28573d6000803e3d6000fd5b505050506040513d6020811015610e3e57600080fd5b5051905080610e94576040805162461bcd60e51b815260206004820152601860248201527f4e6f204c5020746f6b656e7320746f207472616e736665720000000000000000604482015290519081900360640190fd5b610eb1610e9f610a96565b83546001600160a01b031690836111d8565b50805460ff60a01b1916905550565b600160208190526000918252604090912080549101546001600160a01b03821691600160a01b900460ff169083565b610ef761128b565b6001600160a01b0316610f08610a96565b6001600160a01b031614610f63576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6001600160a01b038116610fa85760405162461bcd60e51b815260040180806020018281038252602681526020018061155d6026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b801580611089575060408051636eb1769f60e11b81523060048201526001600160a01b03848116602483015291519185169163dd62ed3e91604480820192602092909190829003018186803b15801561105b57600080fd5b505afa15801561106f573d6000803e3d6000fd5b505050506040513d602081101561108557600080fd5b5051155b6110c45760405162461bcd60e51b81526004018080602001828103825260368152602001806115f66036913960400191505060405180910390fd5b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663095ea7b360e01b17905261111690849061128f565b505050565b604080516001600160a01b0380861660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b17905261117590859061128f565b50505050565b6000828211156111d2576040805162461bcd60e51b815260206004820152601e60248201527f536166654d6174683a207375627472616374696f6e206f766572666c6f770000604482015290519081900360640190fd5b50900390565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b17905261111690849061128f565b600082820183811015611284576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b3390565b60006112e4826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166113409092919063ffffffff16565b8051909150156111165780806020019051602081101561130357600080fd5b50516111165760405162461bcd60e51b815260040180806020018281038252602a8152602001806115cc602a913960400191505060405180910390fd5b606061134f8484600085611357565b949350505050565b6060824710156113985760405162461bcd60e51b81526004018080602001828103825260268152602001806115836026913960400191505060405180910390fd5b6113a1856114b2565b6113f2576040805162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015290519081900360640190fd5b600080866001600160a01b031685876040518082805190602001908083835b602083106114305780518252601f199092019160209182019101611411565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d8060008114611492576040519150601f19603f3d011682016040523d82523d6000602084013e611497565b606091505b50915091506114a78282866114b8565b979650505050505050565b3b151590565b606083156114c7575081611284565b8251156114d75782518084602001fd5b8160405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015611521578181015183820152602001611509565b50505050905090810190601f16801561154e5780820380516001836020036101000a031916815260200191505b509250505060405180910390fdfe4f776e61626c653a206e6577206f776e657220697320746865207a65726f2061646472657373416464726573733a20696e73756666696369656e742062616c616e636520666f722063616c6c546f6b656e20616d6f756e74206d7573742062652067726561746572207468616e20305361666545524332303a204552433230206f7065726174696f6e20646964206e6f7420737563636565645361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f20746f206e6f6e2d7a65726f20616c6c6f77616e6365a2646970667358221220bf18ca841b2451e02f9fc97ba2e9aeee05a960899bd37b73fd7fdb1dda1c03f764736f6c63430007060033";

type UniswapHandlerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: UniswapHandlerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class UniswapHandler__factory extends ContractFactory {
  constructor(...args: UniswapHandlerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _uniswapRouterAddress: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_uniswapRouterAddress, overrides || {});
  }
  override deploy(
    _uniswapRouterAddress: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_uniswapRouterAddress, overrides || {}) as Promise<
      UniswapHandler & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): UniswapHandler__factory {
    return super.connect(runner) as UniswapHandler__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UniswapHandlerInterface {
    return new Interface(_abi) as UniswapHandlerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): UniswapHandler {
    return new Contract(address, _abi, runner) as unknown as UniswapHandler;
  }
}
