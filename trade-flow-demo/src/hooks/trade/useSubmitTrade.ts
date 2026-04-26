"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTradeSigningFlow } from "@/src/lib/trade/encode";
import { mockSignPayload } from "@/src/lib/trade/mock-signer";

import type {
  SubmitTradeRequest,
  SubmitTradeResponse,
  TradeFormInput,
} from "@/src/lib/trade/types";

type SubmitTradeInput = {
  account: `0x${string}`;
  input: TradeFormInput;
};

async function postSubmitTrade(
  request: SubmitTradeRequest,
): Promise<SubmitTradeResponse> {
  const response = await fetch("/api/trade/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to submit trade.");
  }

  return data;
}

async function submitTrade(
  input: SubmitTradeInput,
): Promise<SubmitTradeResponse> {
  const { signingPayload } = createTradeSigningFlow({
    account: input.account,
    input: input.input,
  });

  const signature = await mockSignPayload({
    account: input.account,
    payload: signingPayload,
  });

  return postSubmitTrade({
    payload: signingPayload,
    signature,
  });
}

export function useSubmitTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["trade", "submit"],
    mutationFn: submitTrade,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["trade", "orders"],
      });
    },
  });
}
