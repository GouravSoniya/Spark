"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { raiseMergeRequest } from "@/lib/actions/ideas";

export function MergeRequestForm({ ideaId }: { ideaId: number }) {
  const [open, setOpen] = useState(false);
  const [proposal, setProposal] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus size={14} />
        Propose a change
      </Button>
    );
  }

  return (
    <div className="border border-hairline rounded-md p-4">
      <label className="block text-sm text-paper mb-2">
        What's missing or should change?
      </label>
      <Textarea
        autoFocus
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
        placeholder="Describe the feature or change you think this idea needs..."
      />
      <p className="mt-2 text-xs text-muted">
        Needs 70% upvotes within 48 hours to merge — otherwise it's dropped.
      </p>
      <div className="flex gap-2 mt-3">
        <Button
          size="sm"
          disabled={!proposal.trim() || isPending}
          onClick={() =>
            startTransition(async () => {
              await raiseMergeRequest(ideaId, proposal);
              setProposal("");
              setOpen(false);
            })
          }
        >
          {isPending ? "Submitting…" : "Submit for voting"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
