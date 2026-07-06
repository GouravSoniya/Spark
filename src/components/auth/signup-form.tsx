"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmberMark } from "@/components/ideas/ember-mark";
import { signup } from "@/lib/actions/auth";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, { error: null });

  return (
    <div className="mx-auto max-w-sm px-4 pt-16">
      <div className="flex justify-center mb-6">
        <EmberMark version={1} size={32} />
      </div>
      <h1 className="font-display text-2xl italic text-paper text-center mb-8">
        Bring your gap to Spark
      </h1>

      <form className="space-y-4" action={formAction}>
        <div>
          <label className="block text-sm text-paper mb-2">Username</label>
          <Input name="username" placeholder="what people will see" required />
        </div>
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
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-ember hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}