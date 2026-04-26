"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";

import { tradeFormSchema } from "@/src/lib/trade/schema";
import type { TradeFormInput } from "@/src/lib/trade/types";
import { useSubmitTrade } from "@/src/hooks/trade/useSubmitTrade";

type TradeFormProps = {
  account?: `0x${string}`;
  onSubmitted?: (orderId: string) => void;
};

const defaultValues: TradeFormInput = {
  side: "buy",
  market: "ETH-USDC",
  amount: "1",
  price: "2500",
  slippageBps: "50",
  deadlineSeconds: "60",
};

export function TradeForm({ account, onSubmitted }: TradeFormProps) {
  const submitTrade = useSubmitTrade();

  const form = useForm<TradeFormInput>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const isReady = useMemo(() => {
    return Boolean(account) && !submitTrade.isPending;
  }, [account, submitTrade.isPending]);

  async function onSubmit(values: TradeFormInput) {
    if (!account) {
      form.setError("root", {
        message: "Please connect wallet before submitting a trade.",
      });
      return;
    }

    try {
      const response = await submitTrade.mutateAsync({
        account,
        input: values,
      });

      onSubmitted?.(response.orderId);

      form.clearErrors("root");
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error ? error.message : "Failed to submit trade.",
      });
    }
  }

  const rootError = form.formState.errors.root?.message;

  return (
    <Card className="w-full border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Place Limit Order</CardTitle>
        <CardDescription>
          Enter trade parameters, build an operation, sign the payload, and
          submit it to the mock backend.
        </CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="side">Side</FieldLabel>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={form.watch("side") === "buy" ? "default" : "outline"}
                  onClick={() =>
                    form.setValue("side", "buy", {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  Buy
                </Button>

                <Button
                  type="button"
                  variant={
                    form.watch("side") === "sell" ? "default" : "outline"
                  }
                  onClick={() =>
                    form.setValue("side", "sell", {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  Sell
                </Button>
              </div>

              <FieldDescription>
                Choose whether this mock order is a buy or sell order.
              </FieldDescription>

              {form.formState.errors.side && (
                <FieldError>{form.formState.errors.side.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="market">Market</FieldLabel>
              <Input
                id="market"
                placeholder="ETH-USDC"
                {...form.register("market")}
              />
              <FieldDescription>
                Trading pair used by the mock matching system.
              </FieldDescription>
              {form.formState.errors.market && (
                <FieldError>{form.formState.errors.market.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <InputGroup>
                <Input
                  id="amount"
                  inputMode="decimal"
                  placeholder="1"
                  {...form.register("amount")}
                />
                <InputGroupAddon>
                  <InputGroupText>ETH</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                The base asset amount you want to trade.
              </FieldDescription>
              {form.formState.errors.amount && (
                <FieldError>{form.formState.errors.amount.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="price">Limit Price</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <Input
                  id="price"
                  inputMode="decimal"
                  placeholder="2500"
                  {...form.register("price")}
                />
              </InputGroup>
              <FieldDescription>
                The limit price used to build the order operation.
              </FieldDescription>
              {form.formState.errors.price && (
                <FieldError>{form.formState.errors.price.message}</FieldError>
              )}
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="slippageBps">Slippage</FieldLabel>
                <InputGroup>
                  <Input
                    id="slippageBps"
                    inputMode="numeric"
                    placeholder="50"
                    {...form.register("slippageBps")}
                  />
                  <InputGroupAddon>
                    <InputGroupText>bps</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  50 bps means 0.5% max slippage.
                </FieldDescription>
                {form.formState.errors.slippageBps && (
                  <FieldError>
                    {form.formState.errors.slippageBps.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="deadlineSeconds">Deadline</FieldLabel>
                <InputGroup>
                  <Input
                    id="deadlineSeconds"
                    inputMode="numeric"
                    placeholder="60"
                    {...form.register("deadlineSeconds")}
                  />
                  <InputGroupAddon>
                    <InputGroupText>sec</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  The order expires after this many seconds.
                </FieldDescription>
                {form.formState.errors.deadlineSeconds && (
                  <FieldError>
                    {form.formState.errors.deadlineSeconds.message}
                  </FieldError>
                )}
              </Field>
            </div>

            {!account && (
              <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                Wallet is not connected. The form can be edited, but submission
                is disabled until an account is available.
              </div>
            )}

            {rootError && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {rootError}
              </div>
            )}
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset(defaultValues)}
            disabled={submitTrade.isPending}
          >
            Reset
          </Button>

          <Button type="submit" disabled={!isReady}>
            {submitTrade.isPending ? "Submitting..." : "Sign & Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
