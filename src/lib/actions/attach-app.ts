"use server";

import { createClient } from "../supabase/server";
import { headers } from "next/headers";
import DodoPayments from "dodopayments";

// Checkout-session creation can safely live in Next.js (the Dodo secret
// key stays server-side either way). The actual attachment write must
// wait for Dodo's webhook confirmation — that part happens in a Supabase
// Edge Function, since a client redirect back to this site is never proof
// a payment succeeded. This action must NOT touch the `apps` table.

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment:
    process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
      ? "live_mode"
      : "test_mode",
});

export interface AttachAppInput {
  ideaId: number;
  title: string;
  description: string;
  link: string;
}

export async function createAttachCheckout(input: AttachAppInput) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in to attach an app.");
  }

  // We still read the idea's current version here — not to trust it later,
  // but to snapshot "what version did the user see when they paid" into
  // metadata, so the webhook doesn't have to guess.
  const { data: idea, error: ideaError } = await supabase
    .from("ideas")
    .select("version")
    .eq("id", input.ideaId)
    .single();

  if (ideaError || !idea) {
    throw new Error("Idea not found");
  }

  const headersList = await headers();
  const origin =
    headersList.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL!;

  const session = await dodo.checkoutSessions.create({
    product_cart: [
      {
        product_id: process.env.DODO_ATTACH_APP_PRODUCT_ID!, // fixed-price "attach app" product from Dodo dashboard
        quantity: 1,
      },
    ],
    customer: {
      email: user.email!,
      name: (user.user_metadata?.full_name as string | undefined) ?? user.email!,
    },
    return_url: `${origin}/ideas/${input.ideaId}`,
    cancel_url: `${origin}/ideas/${input.ideaId}`,
    // Everything the webhook needs to build the `apps` row lives here.
    // Never trust anything the client sends after redirect — only this
    // metadata, which Dodo echoes back signed on the webhook event.
    metadata: {
      ideaId: String(input.ideaId),
      title: input.title,
      description: input.description,
      link: input.link,
      profileId: user.id,
      ideaVersionAtAttach: String(idea.version),
    },
  });

  return { url: session.checkout_url };
}