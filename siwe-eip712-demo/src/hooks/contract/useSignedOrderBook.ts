"use client";

import { useAccount, useSignTypedData, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { contracts, deploymentMeta } from "@/src/lib/contracts";

export type SignedOrder = {
  maker: `0x${string}`;
  token: `0x${string}`;
  recipient: `0x${string}`;
  amount: bigint;
  deadline: bigint;
  nonce: `0x${string}`;
};

const orderTypes = {
  Order: [
    { name: "maker", type: "address" },
    { name: "token", type: "address" },
    { name: "recipient", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "deadline", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
} as const;

export function useSignedOrderBook() {
  const { address } = useAccount();
  const { signTypedDataAsync, isPending: isSigningPending } =
    useSignTypedData();
  const { writeContractAsync, isPending: isExecutePending } =
    useWriteContract();

  async function signOrder(params: {
    recipient: `0x${string}`;
    amount: string;
    nonce: `0x${string}`;
    deadlineSeconds?: number;
  }) {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    const deadline =
      BigInt(Math.floor(Date.now() / 1000)) +
      BigInt(params.deadlineSeconds ?? 3600);

    const order: SignedOrder = {
      maker: address,
      token: contracts.demoERC20.address,
      recipient: params.recipient,
      amount: parseUnits(params.amount, 18),
      deadline,
      nonce: params.nonce,
    };

    const signature = await signTypedDataAsync({
      account: address,
      domain: {
        name: "SignedOrderBook",
        version: "1",
        chainId: deploymentMeta.chainId,
        verifyingContract: contracts.signedOrderBook.address,
      },
      types: orderTypes,
      primaryType: "Order",
      message: order,
    });

    return {
      order,
      signature,
    };
  }

  async function executeOrder(order: SignedOrder, signature: `0x${string}`) {
    return writeContractAsync({
      ...contracts.signedOrderBook,
      functionName: "executeOrder",
      args: [order, signature],
    });
  }

  return {
    signOrder,
    executeOrder,
    isSigningPending,
    isExecutePending,
  };
}
