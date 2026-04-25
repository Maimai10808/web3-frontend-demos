import { SiweStatus } from "@/src/components/siwe-status";
import { OrderSigner } from "../components/order-signer";
import { SignatureFlowExplainer } from "../components/signature-flow-explainer";

export default function HomePage() {
  return (
    <main className="islamic-page-shell islamic-geometric-grid min-h-screen overflow-hidden px-6 py-16 md:px-12 md:py-28 lg:px-20 lg:py-36">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 lg:gap-14">
        <section className="relative rounded-xl border-2 border-[#c9a74e] bg-[#1a3a5c]/86 px-6 py-12 text-center text-[#f5ecd7] shadow-[0_8px_24px_rgba(201,167,78,0.2)] md:px-12 lg:px-16">
          <div className="pointer-events-none absolute inset-4 rounded-lg border border-[#c9a74e]/35" />
          <div className="mx-auto flex max-w-4xl flex-col items-center">
            <div className="islamic-kicker font-sans text-xs text-[#c9a74e] md:text-sm">
              Wallet Identity Pavilion
            </div>
            <h1 className="mt-6 font-sans text-5xl font-semibold tracking-wide text-[#f5ecd7] md:text-7xl lg:text-8xl">
              A Dual-Signature Interface for SIWE and EIP-712
            </h1>
            <p className="mt-6 max-w-3xl font-sans text-sm leading-7 text-[#f5ecd7]/82 md:text-base">
              Reframed in deep blue, gilded gold, and ivory, this demo keeps the
              existing logic intact while presenting wallet connection and SIWE
              session verification above structured EIP-712 signing and backend
              verification.
            </p>
          </div>
        </section>

        <div className="grid items-start gap-8 xl:grid-cols-[0.92fr_1.08fr]">
          <SiweStatus />
          <div className="space-y-8">
            <OrderSigner />
            <SignatureFlowExplainer />
          </div>
        </div>

        <section className="rounded-xl border-2 border-[#c9a74e] bg-[#f5ecd7]/88 p-8 shadow-[0_4px_12px_rgba(201,167,78,0.15)]">
          <div className="grid gap-5 text-center md:grid-cols-3">
            {[
              [
                "Step 01",
                "Connect",
                "Connect a wallet and read the active address and chain ID.",
              ],
              [
                "Step 02",
                "Authenticate",
                "Create a trusted session by completing Sign-In with Ethereum.",
              ],
              [
                "Step 03",
                "Authorize",
                "Sign EIP-712 typed data and send it to the backend for verification.",
              ],
            ].map(([step, title, description]) => (
              <div
                key={step}
                className="rounded-xl border-2 border-[#c9a74e] bg-[#fff9ea] p-8 shadow-[0_4px_12px_rgba(201,167,78,0.15)] transition-all duration-300 ease-in-out hover:shadow-[0_6px_20px_rgba(201,167,78,0.25)]"
              >
                <div className="font-sans text-xs font-semibold tracking-[0.24em] text-[#c9a74e] md:text-sm">
                  {step}
                </div>
                <h2 className="mt-4 font-sans text-lg font-semibold tracking-wide text-[#1a3a5c] md:text-xl">
                  {title}
                </h2>
                <p className="mt-3 font-sans text-sm leading-7 text-[#1a3a5c]/78 md:text-base">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
