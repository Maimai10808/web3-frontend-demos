"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  SubmitTradeRequest,
  SubmitTradeResponse,
} from "@/src/lib/trade/types";

async function submitTrade(
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
