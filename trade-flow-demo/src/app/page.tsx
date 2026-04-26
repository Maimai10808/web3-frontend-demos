"use client";

import { TradeForm } from "@/src/components/trade/trade-form";

export default function Page() {
  const mockAccount = "0x0000000000000000000000000000000000000001";

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <TradeForm account={mockAccount} />
    </main>
  );
}
