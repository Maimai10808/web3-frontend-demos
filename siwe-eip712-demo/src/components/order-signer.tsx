"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { orderFormSchema, type OrderFormInput } from "@/src/lib/eip712";
import { useOrderSigner } from "@/src/hooks/useOrderSigner";

export function OrderSigner() {
  const {
    sessionSnapshot,
    signature,
    result,
    errorMessage,
    isPending,
    auth,
    signAndVerify,
  } = useOrderSigner();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormInput>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      token: "0x0000000000000000000000000000000000000000",
      amount: "1000000000000000000",
      price: "250000000000000000",
    },
  });

  async function onSubmit(values: OrderFormInput) {
    await signAndVerify(values);
  }

  return (
    <section className="islamic-card mx-auto w-full max-w-2xl rounded-xl border-2 border-[#c9a74e] p-8 shadow-[0_8px_24px_rgba(201,167,78,0.2)]">
      <div className="relative z-10 space-y-5 text-sm">
        <div className="text-center">
          <div className="islamic-kicker font-sans text-xs font-semibold text-[#c9a74e] md:text-sm">
            Authorization Chamber
          </div>
          <h2 className="mt-4 font-sans text-2xl font-semibold tracking-wide text-[#1a3a5c] md:text-3xl">
            EIP-712 Business Signature
          </h2>
          <p className="mt-3 font-sans text-sm leading-7 text-[#1a3a5c]/76 md:text-base">
            Sign a mock order with typed data, then recover and verify the
            signer on the backend without altering the existing flow.
          </p>
        </div>

        <div className="rounded-xl border-2 border-[#c9a74e] bg-[#fff9ea] p-8 shadow-[0_4px_12px_rgba(201,167,78,0.15)]">
          <div className="font-sans text-lg font-semibold tracking-wide text-[#1a3a5c] md:text-xl">
            Session Snapshot
          </div>
          <div className="islamic-divider mt-4" />
          <pre className="islamic-code-block mt-5 overflow-auto rounded-lg border-2 border-[#c9a74e] p-4 font-sans text-xs leading-6 tracking-wide text-[#1a3a5c]">
            {JSON.stringify(sessionSnapshot, null, 2)}
          </pre>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-xl border-2 border-[#c9a74e] bg-[#fff9ea] p-8 shadow-[0_4px_12px_rgba(201,167,78,0.15)]">
            <div className="font-sans text-lg font-semibold tracking-wide text-[#1a3a5c] md:text-xl">
              Mock Order Form
            </div>
            <div className="islamic-divider mt-4" />

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="font-sans text-xs font-semibold tracking-[0.18em] text-[#c9a74e] md:text-sm">
                  Token address
                </span>
                <input
                  {...register("token")}
                  className="mt-2 w-full rounded-lg border-2 border-[#1a3a5c]/30 bg-[#f5ecd7] px-3 py-2 font-sans tracking-wide text-[#1a3a5c] focus:border-[#c9a74e] focus:outline-none focus:shadow-[0_0_0_3px_rgba(201,167,78,0.15)] md:px-4 md:py-3"
                />
                {errors.token && (
                  <p className="mt-2 font-sans text-xs tracking-wide text-[#8b3a2e]">
                    {errors.token.message}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="font-sans text-xs font-semibold tracking-[0.18em] text-[#c9a74e] md:text-sm">
                  Amount
                </span>
                <input
                  {...register("amount")}
                  className="mt-2 w-full rounded-lg border-2 border-[#1a3a5c]/30 bg-[#f5ecd7] px-3 py-2 font-sans tracking-wide text-[#1a3a5c] focus:border-[#c9a74e] focus:outline-none focus:shadow-[0_0_0_3px_rgba(201,167,78,0.15)] md:px-4 md:py-3"
                />
                {errors.amount && (
                  <p className="mt-2 font-sans text-xs tracking-wide text-[#8b3a2e]">
                    {errors.amount.message}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="font-sans text-xs font-semibold tracking-[0.18em] text-[#c9a74e] md:text-sm">
                  Price
                </span>
                <input
                  {...register("price")}
                  className="mt-2 w-full rounded-lg border-2 border-[#1a3a5c]/30 bg-[#f5ecd7] px-3 py-2 font-sans tracking-wide text-[#1a3a5c] focus:border-[#c9a74e] focus:outline-none focus:shadow-[0_0_0_3px_rgba(201,167,78,0.15)] md:px-4 md:py-3"
                />
                {errors.price && (
                  <p className="mt-2 font-sans text-xs tracking-wide text-[#8b3a2e]">
                    {errors.price.message}
                  </p>
                )}
              </label>
            </div>
          </div>

          {!auth.canSign && (
            <div className="rounded-xl border-2 border-[#c9a74e] bg-[#f3e3bd] p-8 font-sans text-sm leading-7 text-[#1a3a5c] shadow-[0_4px_12px_rgba(201,167,78,0.15)]">
              You must connect wallet and complete SIWE login before signing
              typed data.
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl border-2 border-[#c9a74e] bg-[#f7ddcf] p-8 font-sans text-sm leading-7 text-[#8b3a2e] shadow-[0_4px_12px_rgba(201,167,78,0.15)]">
              {errorMessage}
            </div>
          )}

          <button
            disabled={!auth.canSign || isPending}
            type="submit"
            className="w-full rounded-lg border-2 border-[#c9a74e] bg-[#1a3a5c] px-4 py-3 font-sans text-sm font-semibold tracking-wider text-[#f5ecd7] transition-all duration-300 ease-in-out active:opacity-80 hover:shadow-[0_6px_20px_rgba(201,167,78,0.25)] focus:shadow-[0_0_0_3px_rgba(201,167,78,0.15)] disabled:cursor-not-allowed disabled:bg-[#1a3a5c]/55 disabled:text-[#f5ecd7]/70"
          >
            {isPending ? "Signing..." : "Sign Order"}
          </button>
        </form>

        {signature && (
          <div className="rounded-xl border-2 border-[#c9a74e] bg-[#fff9ea] p-8 shadow-[0_4px_12px_rgba(201,167,78,0.15)]">
            <div className="font-sans text-lg font-semibold tracking-wide text-[#1a3a5c] md:text-xl">
              Signature
            </div>
            <div className="islamic-divider mt-4" />
            <pre className="islamic-code-block mt-5 overflow-auto break-all rounded-lg border-2 border-[#c9a74e] p-4 font-sans text-xs leading-6 tracking-wide text-[#1a3a5c]">
              {signature}
            </pre>
          </div>
        )}

        {result && (
          <div className="rounded-xl border-2 border-[#c9a74e] bg-[#fff9ea] p-8 shadow-[0_4px_12px_rgba(201,167,78,0.15)]">
            <div className="font-sans text-lg font-semibold tracking-wide text-[#1a3a5c] md:text-xl">
              Backend Verify Result
            </div>
            <div className="islamic-divider mt-4" />
            <pre className="islamic-code-block mt-5 overflow-auto rounded-lg border-2 border-[#c9a74e] p-4 font-sans text-xs leading-6 tracking-wide text-[#1a3a5c]">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}
