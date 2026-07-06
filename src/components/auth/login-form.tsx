"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmberMark } from "@/components/ideas/ember-mark";
import { signin } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signin, { error: null });

  return (
    <div className="mx-auto max-w-sm px-4 pt-16">
      <div className="flex justify-center mb-6">
        <EmberMark version={5} size={32} />
      </div>
      <h1 className="font-display text-2xl italic text-paper text-center mb-8">
        Welcome back
      </h1>

      <form className="space-y-4" action={formAction}>
        <div>
          <label className="block text-sm text-paper mb-2">Email</label>
          <Input type="email" name="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="block text-sm text-paper mb-2">Password</label>
          <Input type="password" name="password" placeholder="••••••••" required />
        </div>

        {state.error && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="text-ember hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}