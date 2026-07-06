"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createAttachCheckout } from "@/lib/actions/attach-app";

export function AttachAppForm({ ideaId }: { ideaId: number }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [isPending, startTransition] = useTransition();

  const valid = title.trim() && description.trim() && link.trim();

  function submit() {
    startTransition(async () => {
      const { url } = await createAttachCheckout({ideaId: ideaId, title, description, link });
      router.push(url);
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm text-paper mb-2">App title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="SplitFair" />
      </div>
      <div>
        <label className="block text-sm text-paper mb-2">Short description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does it do, in one or two sentences?"
          className="min-h-20"
        />
      </div>
      <div>
        <label className="block text-sm text-paper mb-2">Link</label>
        <Input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="GitHub repo, Play Store, App Store, or your web app"
        />
      </div>

      <div className="border border-hairline rounded-md p-4 bg-surface flex items-center justify-between">
        <div>
          <p className="text-sm text-paper">One-time attach fee</p>
          <p className="text-xs text-muted mt-0.5">
            Keeps the section limited to apps people actually shipped.
          </p>
        </div>
        <span className="font-mono text-sm text-amber">₹99</span>
      </div>

      <Button disabled={!valid || isPending} onClick={submit}>
        <CreditCard size={15} />
        {isPending ? "Redirecting to checkout…" : "Pay & attach"}
      </Button>
    </div>
  );
}
