// src/components/SiweStatus.tsx

"use client";

import { signOut } from "next-auth/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSiweStatusViewModel } from "@/hooks/useSiweStatusViewModel";

export function SiweStatus() {
  const { wallet, auth } = useSiweStatusViewModel();

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          SIWE Demo
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Connect wallet, sign in with Ethereum, and inspect session state.
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <ConnectButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Wallet State
          </h2>

          <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-white p-3">
              <div className="text-slate-500">Connected</div>
              <div className="mt-1 font-medium text-slate-900">
                {wallet.isConnected ? "Yes" : "No"}
              </div>
            </div>

            <div className="rounded-xl bg-white p-3">
              <div className="text-slate-500">Address</div>
              <div className="mt-1 break-all font-medium text-slate-900">
                {wallet.address ?? "Not connected"}
              </div>
            </div>

            <div className="rounded-xl bg-white p-3">
              <div className="text-slate-500">Short address</div>
              <div className="mt-1 font-medium text-slate-900">
                {wallet.shortAddress}
              </div>
            </div>

            <div className="rounded-xl bg-white p-3">
              <div className="text-slate-500">Chain ID</div>
              <div className="mt-1 font-medium text-slate-900">
                {wallet.chainId ?? "N/A"}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Auth Session
          </h2>

          <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-white p-3">
              <div className="text-slate-500">Session status</div>
              <div className="mt-1 font-medium text-slate-900">
                {auth.status}
              </div>
            </div>

            <div className="rounded-xl bg-white p-3">
              <div className="text-slate-500">Authenticated address</div>
              <div className="mt-1 break-all font-medium text-slate-900">
                {auth.sessionAddress ?? "Not signed in"}
              </div>
            </div>

            <div className="rounded-xl bg-white p-3">
              <div className="text-slate-500">Auth state</div>
              <div className="mt-1 font-medium text-slate-900">
                {auth.isSignedIn ? "Signed in" : "Signed out"}
              </div>
            </div>
          </div>

          {auth.isSignedIn && (
            <div className="mt-5">
              <button
                onClick={() => signOut()}
                className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
