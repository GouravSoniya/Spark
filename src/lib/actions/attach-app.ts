"use server";

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";
// Checkout-session creation can safely live in Next.js (the Dodo secret
// key stays server-side either way). The actual attachment write must
// wait for Dodo's webhook confirmation — that part happens in an Edge
// Function, since a client redirect back to this site is never proof a
// payment succeeded.

export interface AttachAppInput {
  ideaId: number;
  title: string;
  description: string;
  link: string;
}

export async function createAttachCheckout(input: AttachAppInput) {
  // const dodo = new DodoPayments({ apiKey: process.env.DODO_SECRET_KEY! });
  // const session = await dodo.checkoutSessions.create({
  //   amount: ATTACH_FEE_CENTS,
  //   success_url: `${origin}/ideas/${input.ideaId}?attached=1`,
  //   metadata: { ideaId: input.ideaId, ...input },
  // });
  // return { url: session.url };
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  const { data :  idea , error: insertError } = await supabase.from("ideas").select("version").eq("id", input.ideaId).single();
  if (insertError || !idea) {
    throw new Error("Idea not found");
  }

  const { data , error } = await supabase.from("apps").insert({
    idea: input.ideaId,
    title: input.title,
    description: input.description,
    app_link: input.link,
    profile: user?.id,
    ideaVersionAtAttach : idea.version,
  });

  revalidatePath(`/ideas/${input.ideaId}`);
  revalidatePath("/");
  return { url: `/ideas/${input.ideaId}` };
}
