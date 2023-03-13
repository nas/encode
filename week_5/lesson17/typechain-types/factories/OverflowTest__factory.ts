/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { OverflowTest, OverflowTestInterface } from "../OverflowTest";

const _abi = [
  {
    inputs: [],
    name: "counter",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "amount",
        type: "uint8",
      },
    ],
    name: "forceIncrement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "amount",
        type: "uint8",
      },
    ],
    name: "increment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061019d806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806361bc221a14610046578063d6b4633014610069578063dbced6281461007e575b600080fd5b6000546100539060ff1681565b60405160ff909116815260200160405180910390f35b61007c6100773660046100f7565b6100c5565b005b61007c61008c3660046100f7565b600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00811660ff9182169390930116919091179055565b6000805482919081906100dc90849060ff16610121565b92506101000a81548160ff021916908360ff16021790555050565b60006020828403121561010957600080fd5b813560ff8116811461011a57600080fd5b9392505050565b60ff8181168382160190811115610161577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b9291505056fea26469706673582212201ff3521314c5980dc679a0129dbec8363b51442320715b57488114e65d3c203964736f6c63430008120033";

type OverflowTestConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OverflowTestConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class OverflowTest__factory extends ContractFactory {
  constructor(...args: OverflowTestConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<OverflowTest> {
    return super.deploy(overrides || {}) as Promise<OverflowTest>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): OverflowTest {
    return super.attach(address) as OverflowTest;
  }
  override connect(signer: Signer): OverflowTest__factory {
    return super.connect(signer) as OverflowTest__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OverflowTestInterface {
    return new utils.Interface(_abi) as OverflowTestInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OverflowTest {
    return new Contract(address, _abi, signerOrProvider) as OverflowTest;
  }
}
