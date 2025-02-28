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
import type { GhostPad, GhostPadInterface } from "../GhostPad";

const _abi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_tokenTemplate",
        type: "address",
        internalType: "address",
      },
      {
        name: "_governance",
        type: "address",
        internalType: "address",
      },
      {
        name: "_tornadoInstances",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "_uniswapHandler",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "fallback",
    stateMutability: "payable",
  },
  {
    type: "receive",
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "MAX_GOVERNANCE_FEE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint32",
        internalType: "uint32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deployToken",
    inputs: [
      {
        name: "tokenData",
        type: "tuple",
        internalType: "struct GhostPad.TokenData",
        components: [
          {
            name: "name",
            type: "string",
            internalType: "string",
          },
          {
            name: "symbol",
            type: "string",
            internalType: "string",
          },
          {
            name: "initialSupply",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
          {
            name: "burnEnabled",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "liquidityLockPeriod",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "liquidityTokenAmount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "useProtocolFee",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "vestingEnabled",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
      {
        name: "proofData",
        type: "tuple",
        internalType: "struct GhostPad.ProofData",
        components: [
          {
            name: "instanceIndex",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "proof",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "root",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "nullifierHash",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address payable",
          },
          {
            name: "relayer",
            type: "address",
            internalType: "address payable",
          },
          {
            name: "fee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "refund",
            type: "uint256",
            internalType: "uint256",
          },
        ],
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
    name: "deployTokenWithLiquidity",
    inputs: [
      {
        name: "tokenData",
        type: "tuple",
        internalType: "struct GhostPad.TokenData",
        components: [
          {
            name: "name",
            type: "string",
            internalType: "string",
          },
          {
            name: "symbol",
            type: "string",
            internalType: "string",
          },
          {
            name: "initialSupply",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
          {
            name: "burnEnabled",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "liquidityLockPeriod",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "liquidityTokenAmount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "useProtocolFee",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "vestingEnabled",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
      {
        name: "proofData",
        type: "tuple",
        internalType: "struct GhostPad.ProofData",
        components: [
          {
            name: "instanceIndex",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "proof",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "root",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "nullifierHash",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address payable",
          },
          {
            name: "relayer",
            type: "address",
            internalType: "address payable",
          },
          {
            name: "fee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "refund",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "deployedTokens",
    inputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
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
    name: "getDeployedToken",
    inputs: [
      {
        name: "nullifierHash",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
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
    name: "getTornadoInstance",
    inputs: [
      {
        name: "index",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "instance",
        type: "address",
        internalType: "address",
      },
      {
        name: "denomination",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "governance",
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
    name: "governanceFee",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint32",
        internalType: "uint32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "instanceCount",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nullifierHashUsed",
    inputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
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
    name: "recoverERC20",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "recoverETH",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "tokenTemplate",
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
    name: "tornadoInstances",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "instance",
        type: "address",
        internalType: "address",
      },
      {
        name: "denomination",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
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
    name: "uniswapHandler",
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
    name: "updateGovernance",
    inputs: [
      {
        name: "_newGovernance",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateGovernanceFee",
    inputs: [
      {
        name: "_newFee",
        type: "uint32",
        internalType: "uint32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateUniswapHandler",
    inputs: [
      {
        name: "_newHandler",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "GovernanceFeeUpdated",
    inputs: [
      {
        name: "oldFee",
        type: "uint32",
        indexed: false,
        internalType: "uint32",
      },
      {
        name: "newFee",
        type: "uint32",
        indexed: false,
        internalType: "uint32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "GovernanceUpdated",
    inputs: [
      {
        name: "oldGovernance",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newGovernance",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LiquidityPoolCreated",
    inputs: [
      {
        name: "tokenAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "pairAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "liquidityAdded",
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
  {
    type: "event",
    name: "TokenDeployed",
    inputs: [
      {
        name: "nullifierHash",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "tokenAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "name",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "symbol",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UniswapHandlerUpdated",
    inputs: [
      {
        name: "oldHandler",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newHandler",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
] as const;

const _bytecode =
  "0x60806040526007805463ffffffff191661012c1790553480156200002257600080fd5b50604051620021f6380380620021f683398101604081905262000045916200031c565b600062000051620002fb565b600080546001600160a01b0319166001600160a01b0383169081178255604051929350917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a3506001600160a01b038416620000cd5760405162461bcd60e51b8152600401620000c4906200049a565b60405180910390fd5b6001600160a01b038316620000f65760405162461bcd60e51b8152600401620000c4906200042e565b60008251116200011a5760405162461bcd60e51b8152600401620000c49062000508565b6001600160a01b038116620001435760405162461bcd60e51b8152600401620000c490620004d1565b600180546001600160a01b038087166001600160a01b03199283161790925560028054868416908316179055600380549284169290911691909117905560005b8251811015620002f05760008382815181106200019c57fe5b6020026020010151905060006001600160a01b0316816001600160a01b03161415620001dc5760405162461bcd60e51b8152600401620000c49062000465565b6000816001600160a01b0316638bca6d166040518163ffffffff1660e01b815260040160206040518083038186803b1580156200021857600080fd5b505afa1580156200022d573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000253919062000415565b604080518082019091526001600160a01b03938416815260208101918252600480546001808201835560009290925291517f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b600290930292830180546001600160a01b031916919096161790945590517f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19c90910155500162000183565b50505050506200053f565b3390565b80516001600160a01b03811681146200031757600080fd5b919050565b6000806000806080858703121562000332578384fd5b6200033d85620002ff565b935060206200034e818701620002ff565b60408701519094506001600160401b03808211156200036b578485fd5b818801915088601f8301126200037f578485fd5b8151818111156200038c57fe5b83810260405185828201018181108582111715620003a657fe5b604052828152858101935084860182860187018d1015620003c5578889fd5b8895505b83861015620003f257620003dd81620002ff565b855260019590950194938601938601620003c9565b508097505050505050506200040a60608601620002ff565b905092959194509250565b60006020828403121562000427578081fd5b5051919050565b6020808252601a908201527f496e76616c696420676f7665726e616e63652061646472657373000000000000604082015260600190565b6020808252818101527f496e76616c696420746f726e61646f20696e7374616e63652061646472657373604082015260600190565b6020808252601e908201527f496e76616c696420746f6b656e2074656d706c61746520616464726573730000604082015260600190565b6020808252601f908201527f496e76616c696420556e69737761702068616e646c6572206164647265737300604082015260600190565b6020808252601d908201527f4e6f20746f726e61646f20696e7374616e6365732070726f7669646564000000604082015260600190565b611ca7806200054f6000396000f3fe60806040526004361061012e5760003560e01c80638b3b50d4116100ab578063c489084f1161006f578063c489084f146102ee578063c4e1563f14610303578063c743406f14610323578063ec56c71614610350578063ec89266114610372578063f2fde38b1461039257610135565b80638b3b50d4146102715780638da5cb5b14610291578063980426e9146102a6578063a814e728146102bb578063b2561263146102ce57610135565b80635aa6e675116100f25780635aa6e675146101e75780635adbb1fd146101fc578063613095961461021c578063715018a61461023c5780638980f11f1461025157610135565b8063036c06e7146101375780630614117a1461016e5780630814d3dd146101835780630ea90a12146101a55780631aa68fd1146101c757610135565b3661013557005b005b34801561014357600080fd5b506101576101523660046114d2565b6103b2565b604051610165929190611730565b60405180910390f35b34801561017a57600080fd5b506101356103ea565b34801561018f57600080fd5b506101986104d1565b604051610165919061171c565b3480156101b157600080fd5b506101ba6104e0565b6040516101659190611b98565b3480156101d357600080fd5b506101986101e23660046114d2565b6104ec565b3480156101f357600080fd5b5061019861050a565b34801561020857600080fd5b5061013561021736600461140c565b610519565b34801561022857600080fd5b506101986102373660046114d2565b6105f3565b34801561024857600080fd5b5061013561060e565b34801561025d57600080fd5b5061013561026c36600461148b565b6106ba565b34801561027d57600080fd5b5061015761028c3660046114d2565b6107a1565b34801561029d57600080fd5b50610198610817565b3480156102b257600080fd5b506101ba610826565b6101986102c93660046114ea565b61082c565b3480156102da57600080fd5b506101356102e936600461140c565b610979565b3480156102fa57600080fd5b50610198610a1b565b34801561030f57600080fd5b5061019861031e3660046114ea565b610a2a565b34801561032f57600080fd5b5061034361033e3660046114d2565b610af8565b60405161016591906117af565b34801561035c57600080fd5b50610365610b0d565b6040516101659190611b8f565b34801561037e57600080fd5b5061013561038d36600461162d565b610b13565b34801561039e57600080fd5b506101356103ad36600461140c565b610bbe565b600481815481106103c257600080fd5b6000918252602090912060029091020180546001909101546001600160a01b03909116915082565b6103f2610cc0565b6001600160a01b0316610403610817565b6001600160a01b03161461044c576040805162461bcd60e51b81526020600482018190526024820152600080516020611c52833981519152604482015290519081900360640190fd5b60405147906000903390839061046190611719565b60006040518083038185875af1925050503d806000811461049e576040519150601f19603f3d011682016040523d82523d6000602084013e6104a3565b606091505b50509050806104cd5760405162461bcd60e51b81526004016104c4906118f2565b60405180910390fd5b5050565b6001546001600160a01b031681565b60075463ffffffff1681565b6000818152600560205260409020546001600160a01b03165b919050565b6002546001600160a01b031681565b610521610cc0565b6001600160a01b0316610532610817565b6001600160a01b03161461057b576040805162461bcd60e51b81526020600482018190526024820152600080516020611c52833981519152604482015290519081900360640190fd5b6001600160a01b0381166105a15760405162461bcd60e51b81526004016104c490611a06565b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f352ac0a4ef0530fac811e2acd309e300acae59ab29dab8f155d03141e9d6cc8990600090a35050565b6005602052600090815260409020546001600160a01b031681565b610616610cc0565b6001600160a01b0316610627610817565b6001600160a01b031614610670576040805162461bcd60e51b81526020600482018190526024820152600080516020611c52833981519152604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b6106c2610cc0565b6001600160a01b03166106d3610817565b6001600160a01b03161461071c576040805162461bcd60e51b81526020600482018190526024820152600080516020611c52833981519152604482015290519081900360640190fd5b60405163a9059cbb60e01b81526001600160a01b0383169063a9059cbb9061074a9033908590600401611730565b602060405180830381600087803b15801561076457600080fd5b505af1158015610778573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061079c91906114b6565b505050565b600454600090819083106107c75760405162461bcd60e51b81526004016104c49061199f565b6000600484815481106107d657fe5b60009182526020918290206040805180820190915260029092020180546001600160a01b031680835260019091015491909201819052909350915050915091565b6000546001600160a01b031690565b6101f481565b6004548151600091116108515760405162461bcd60e51b81526004016104c490611a82565b60008360c00151116108755760405162461bcd60e51b81526004016104c49061191b565b3060808301526000600483600001518154811061088e57fe5b60009182526020918290206040805180820190915260029092020180546001600160a01b031682526001015491810182905260e08501519092503410156108e75760405162461bcd60e51b81526004016104c490611886565b60405163c4e1563f60e01b8152309063c4e1563f9061090c9088908890600401611ab9565b602060405180830381600087803b15801561092657600080fd5b505af115801561093a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061095e9190611428565b925061096f838660c0015183610cc4565b5050505b92915050565b6002546001600160a01b031633146109a35760405162461bcd60e51b81526004016104c490611a3d565b6001600160a01b0381166109c95760405162461bcd60e51b81526004016104c4906118bb565b600280546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f434a2db650703b36c824e745330d6397cdaa9ee2cc891a4938ae853e1c50b68d90600090a35050565b6003546001600160a01b031681565b6000610a3582610ec8565b60008360e00151610a47576000610a51565b60075463ffffffff165b63ffffffff1690506000610a66858584610fb8565b606085018051600090815260056020908152604080832080546001600160a01b0319166001600160a01b038716179055835183526006825291829020805460ff1916600117905591518851928901519151939450927fca8ec3c306375fc60c5f50f2bfff29d0caa5872f7566da00a1cd0f231ea847f892610ae8928692611749565b60405180910390a2949350505050565b60066020526000908152604090205460ff1681565b60045490565b6002546001600160a01b03163314610b3d5760405162461bcd60e51b81526004016104c4906119cf565b6101f463ffffffff82161115610b655760405162461bcd60e51b81526004016104c490611968565b6007805463ffffffff83811663ffffffff198316179092556040519116907f33c6bc8281dc69bc140761f9d3d812717ab6d2d00bed3e18eb8439320c0e3fea90610bb29083908590611ba9565b60405180910390a15050565b610bc6610cc0565b6001600160a01b0316610bd7610817565b6001600160a01b031614610c20576040805162461bcd60e51b81526020600482018190526024820152600080516020611c52833981519152604482015290519081900360640190fd5b6001600160a01b038116610c655760405162461bcd60e51b8152600401808060200182810382526026815260200180611c0b6026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b3390565b60008083118015610cd55750600082115b15610ec15760035460405163095ea7b360e01b81526001600160a01b038681169263095ea7b392610d0e92909116908790600401611730565b602060405180830381600087803b158015610d2857600080fd5b505af1158015610d3c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d6091906114b6565b50600354604051630f671b3560e11b81526001600160a01b03909116908190631ece366a908590610d9c90899089908490600090600401611789565b6020604051808303818588803b158015610db557600080fd5b505af1158015610dc9573d6000803e3d6000fd5b50505050506040513d601f19601f82011682018060405250810190610dee9190611615565b91506000816001600160a01b0316637c0f8456876040518263ffffffff1660e01b8152600401610e1e919061171c565b60806040518083038186803b158015610e3657600080fd5b505afa158015610e4a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e6e9190611444565b5050509050806001600160a01b0316866001600160a01b03167f3271d3df788594116b4b02c162756c0300666eb726c92c379ca87f8b650a2d4e85604051610eb69190611b8f565b60405180910390a350505b9392505050565b600454815110610eea5760405162461bcd60e51b81526004016104c490611a82565b60006004826000015181548110610efd57fe5b6000918252602091829020604080518082018252600290930290910180546001600160a01b03168084526001909101548385015260e086015193860151868301516060880151608089015160a08a015160c08b015196516310d056db60e11b8152979950949788976321a0adb6979196610f819695949392909188906004016117ba565b6000604051808303818588803b158015610f9a57600080fd5b505af1158015610fae573d6000803e3d6000fd5b5050505050505050565b600154600090610fd0906001600160a01b0316611195565b8351600480549293508392600092908110610fe757fe5b90600052602060002090600202016040518060400160405290816000820160009054906101000a90046001600160a01b03166001600160a01b03166001600160a01b031681526020016001820154815250509050600081602001519050826001600160a01b0316632c013f75886000015189602001518a604001518a608001518c606001518d608001518e60a001518f61010001518a6040518a63ffffffff1660e01b81526004016110a19998979695949392919061180a565b600060405180830381600087803b1580156110bb57600080fd5b505af11580156110cf573d6000803e3d6000fd5b50505050600085111561118b5760006111016127106110fb888b6040015161123290919063ffffffff16565b9061128b565b60025460405163a9059cbb60e01b81529192506001600160a01b038087169263a9059cbb926111369216908590600401611730565b602060405180830381600087803b15801561115057600080fd5b505af1158015611164573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061118891906114b6565b50505b5050509392505050565b6000604051733d602d80600a3d3981f3363d3d373d3d3d363d7360601b81528260601b60148201526e5af43d82803e903d91602b57fd5bf360881b60288201526037816000f09150506001600160a01b038116610505576040805162461bcd60e51b8152602060048201526016602482015275115490cc4c4d8dce8818dc99585d194819985a5b195960521b604482015290519081900360640190fd5b60008261124157506000610973565b8282028284828161124e57fe5b0414610ec15760405162461bcd60e51b8152600401808060200182810382526021815260200180611c316021913960400191505060405180910390fd5b60008082116112e1576040805162461bcd60e51b815260206004820152601a60248201527f536166654d6174683a206469766973696f6e206279207a65726f000000000000604482015290519081900360640190fd5b8183816112ea57fe5b049392505050565b803561050581611be4565b803561050581611bfc565b600082601f830112611318578081fd5b813567ffffffffffffffff81111561132c57fe5b61133f601f8201601f1916602001611bc0565b818152846020838601011115611353578283fd5b816020850160208301379081016020019190915292915050565b6000610100808385031215611380578182fd5b61138981611bc0565b91505081358152602082013567ffffffffffffffff8111156113aa57600080fd5b6113b684828501611308565b60208301525060408201356040820152606082013560608201526113dc608083016112f2565b60808201526113ed60a083016112f2565b60a082015260c082013560c082015260e082013560e082015292915050565b60006020828403121561141d578081fd5b8135610ec181611be4565b600060208284031215611439578081fd5b8151610ec181611be4565b60008060008060808587031215611459578283fd5b845161146481611be4565b602086015190945061147581611bfc565b6040860151606090960151949790965092505050565b6000806040838503121561149d578182fd5b82356114a881611be4565b946020939093013593505050565b6000602082840312156114c7578081fd5b8151610ec181611bfc565b6000602082840312156114e3578081fd5b5035919050565b600080604083850312156114fc578182fd5b823567ffffffffffffffff80821115611513578384fd5b8185019150610120808388031215611529578485fd5b61153281611bc0565b9050823582811115611542578586fd5b61154e88828601611308565b825250602083013582811115611562578586fd5b61156e88828601611308565b6020830152506040830135604082015260608301358281111561158f578586fd5b61159b88828601611308565b6060830152506115ad608084016112fd565b608082015260a083013560a082015260c083013560c08201526115d260e084016112fd565b60e08201526101006115e58185016112fd565b90820152935060208501359150808211156115fe578283fd5b5061160b8582860161136d565b9150509250929050565b600060208284031215611626578081fd5b5051919050565b60006020828403121561163e578081fd5b813563ffffffff81168114610ec1578182fd5b15159052565b60008151808452815b8181101561167c57602081850181015186830182015201611660565b8181111561168d5782602083870101525b50601f01601f19169290920160200192915050565b60006101008251845260208301518160208601526116c282860182611657565b9150506040830151604085015260608301516060850152608083015160018060a01b0380821660808701528060a08601511660a0870152505060c083015160c085015260e083015160e08501528091505092915050565b90565b6001600160a01b0391909116815260200190565b6001600160a01b03929092168252602082015260400190565b6001600160a01b038416815260606020820181905260009061176d90830185611657565b828103604084015261177f8185611657565b9695505050505050565b6001600160a01b0394909416845260208401929092526040830152606082015260800190565b901515815260200190565b600060e082526117cd60e083018a611657565b60208301989098525060408101959095526001600160a01b03938416606086015291909216608084015260a083019190915260c090910152919050565b600061012080835261181e8184018d611657565b90508281036020840152611832818c611657565b604084018b90526001600160a01b038a1660608501528381036080850152905061185c8189611657565b96151560a0840152505060c081019390935290151560e08301526101009091015295945050505050565b6020808252818101527f496e73756666696369656e74204554482073656e7420666f7220726566756e64604082015260600190565b6020808252601a908201527f496e76616c696420676f7665726e616e63652061646472657373000000000000604082015260600190565b6020808252600f908201526e151c985b9cd9995c8819985a5b1959608a1b604082015260600190565b6020808252602d908201527f4c697175696469747920746f6b656e20616d6f756e74206d757374206265206760408201526c0726561746572207468616e203609c1b606082015260800190565b6020808252601b908201527f4665652065786365656473206d6178696d756d20616c6c6f7765640000000000604082015260600190565b602080825260169082015275092dcecc2d8d2c840d2dce6e8c2dcc6ca40d2dcc8caf60531b604082015260600190565b6020808252601e908201527f4f6e6c7920676f7665726e616e63652063616e20757064617465206665650000604082015260600190565b6020808252601f908201527f496e76616c696420556e69737761702068616e646c6572206164647265737300604082015260600190565b60208082526025908201527f4f6e6c7920676f7665726e616e63652063616e2075706461746520676f7665726040820152646e616e636560d81b606082015260800190565b6020808252601c908201527f496e7374616e636520696e646578206f7574206f6620626f756e647300000000604082015260600190565b6000604082528351610120806040850152611ad8610160850183611657565b91506020860151603f1980868503016060870152611af68483611657565b93506040880151608087015260608801519150808685030160a087015250611b1e8382611657565b9250506080860151611b3360c0860182611651565b5060a086015160e085015260c0860151610100818187015260e08801519150611b5e83870183611651565b8701519150611b739050610140850182611651565b508281036020840152611b8681856116a2565b95945050505050565b90815260200190565b63ffffffff91909116815260200190565b63ffffffff92831681529116602082015260400190565b60405181810167ffffffffffffffff81118282101715611bdc57fe5b604052919050565b6001600160a01b0381168114611bf957600080fd5b50565b8015158114611bf957600080fdfe4f776e61626c653a206e6577206f776e657220697320746865207a65726f2061646472657373536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f774f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572a2646970667358221220736a9f831e2f2193d0379b4889b6c66eea240ab4d40e6095d82636859f0cfbc664736f6c63430007060033";

type GhostPadConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GhostPadConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GhostPad__factory extends ContractFactory {
  constructor(...args: GhostPadConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _tokenTemplate: AddressLike,
    _governance: AddressLike,
    _tornadoInstances: AddressLike[],
    _uniswapHandler: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _tokenTemplate,
      _governance,
      _tornadoInstances,
      _uniswapHandler,
      overrides || {}
    );
  }
  override deploy(
    _tokenTemplate: AddressLike,
    _governance: AddressLike,
    _tornadoInstances: AddressLike[],
    _uniswapHandler: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _tokenTemplate,
      _governance,
      _tornadoInstances,
      _uniswapHandler,
      overrides || {}
    ) as Promise<
      GhostPad & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): GhostPad__factory {
    return super.connect(runner) as GhostPad__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GhostPadInterface {
    return new Interface(_abi) as GhostPadInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): GhostPad {
    return new Contract(address, _abi, runner) as unknown as GhostPad;
  }
}
