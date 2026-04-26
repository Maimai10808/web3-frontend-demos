import { NextResponse } from "next/server";
import { createOrderFromOperation } from "@/src/lib/trade/order-store";
import type { SubmitTradeRequest } from "@/src/lib/trade/types";

function isValidSignature(signature: unknown) {
  return typeof signature === "string" && signature.startsWith("mock_sig_");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitTradeRequest;

    if (!body.payload || !body.signature) {
      return NextResponse.json(
        {
          message: "Missing payload or signature.",
        },
        { status: 400 },
      );
    }

    if (!isValidSignature(body.signature)) {
      return NextResponse.json(
        {
          message: "Invalid mock signature.",
        },
        { status: 401 },
      );
    }

    const { operation } = body.payload;

    if (!operation) {
      return NextResponse.json(
        {
          message: "Missing operation.",
        },
        { status: 400 },
      );
    }

    if (operation.tradeData.deadline * 1000 < Date.now()) {
      return NextResponse.json(
        {
          message: "Trade operation expired.",
        },
        { status: 400 },
      );
    }

    const response = createOrderFromOperation({
      operation,
      signature: body.signature,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("[trade/submit] error:", error);

    return NextResponse.json(
      {
        message: "Failed to submit trade.",
      },
      { status: 500 },
    );
  }
}
