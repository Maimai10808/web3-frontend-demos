"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { contracts } from "@/src/lib/contracts";

export function useDemoToken() {
  const { address } = useAccount();

  const name = useReadContract({
    ...contracts.demoERC20,
    functionName: "name",
  });

  const symbol = useReadContract({
    ...contracts.demoERC20,
    functionName: "symbol",
  });

  const decimals = useReadContract({
    ...contracts.demoERC20,
    functionName: "decimals",
  });

  const balance = useReadContract({
    ...contracts.demoERC20,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });

  const { writeContractAsync, isPending } = useWriteContract();

  async function transfer(to: `0x${string}`, amount: string) {
    const tokenDecimals = decimals.data ?? 18;

    return writeContractAsync({
      ...contracts.demoERC20,
      functionName: "transfer",
      args: [to, parseUnits(amount, tokenDecimals)],
    });
  }

  return {
    address,
    name: name.data,
    symbol: symbol.data,
    decimals: decimals.data,
    rawBalance: balance.data,
    balance:
      balance.data !== undefined
        ? formatUnits(balance.data, decimals.data ?? 18)
        : "0",
    transfer,
    isTransferPending: isPending,
    refetchBalance: balance.refetch,
  };
}
