"use client";

import { useState, useTransition } from "react";
import { ArrowBigUp, ArrowBigDown, Clock, GitMerge, X, Loader2 } from "lucide-react";
import type { MergeRequest } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { voteMergeRequest } from "@/lib/actions/ideas";
import { cn, hoursRemaining, timeAgo } from "@/lib/utils";

const STATUS_STYLE: Record<MergeRequest["status"], { label: string; tone: "ember" | "muted" | "default" }> = {
  pending: { label: "Voting open", tone: "ember" },
  approved: { label: "Accepted", tone: "default" },
  processing: { label: "Processing", tone: "default" },
  merged: { label: "Merged", tone: "default" },
  rejected: { label: "Rejected", tone: "muted" },
};

export function MergeRequestCard({ mr }: { mr: MergeRequest }) {
  const [upvotes, setUpvotes] = useState(mr.upvotes);
  const [downvotes, setDownvotes] = useState(mr.downvotes);
  const [viewerVote, setViewerVote] = useState(mr.viewerVote ?? null);
  const [, startTransition] = useTransition();

  const total = upvotes + downvotes;
  const upPercent = total > 0 ? Math.round((upvotes / total) * 100) : 0;
  const status = STATUS_STYLE[mr.status];
  const hoursLeft = mr.status === "pending" ? hoursRemaining(mr.expires_at) : null;

  function vote(direction: "up" | "down") {
    const prevVote = viewerVote;
    const nextVote = prevVote === direction ? null : direction;

    // optimistic tally update
    if (prevVote === "up") setUpvotes((v) => v - 1);
    if (prevVote === "down") setDownvotes((v) => v - 1);
    if (nextVote === "up") setUpvotes((v) => v + 1);
    if (nextVote === "down") setDownvotes((v) => v + 1);
    setViewerVote(nextVote);

    startTransition(() => {
      voteMergeRequest(mr.id, mr.idea, direction);
    });
  }

  return (
    <div className="border border-hairline rounded-md p-4">
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <Avatar username={mr.author?.username} avatarUrl={mr.author?.avatar_url} size={16} />
          {mr.author?.username}
          <span>·</span>
          {timeAgo(mr.created_at)}
        </span>
        <Badge tone={status.tone}>
          {mr.status === "approved" && <GitMerge size={11} className="mr-1" />}
          {mr.status === "rejected" && <X size={11} className="mr-1" />}
          {mr.status === "processing" && <Loader2 size={11} className="mr-1 animate-spin" />}
          {status.label}
        </Badge>
      </div>

      <p className="text-sm text-paper leading-relaxed">{mr.merge_content}</p>

      {mr.status === "pending" && (
        <div className="mt-3.5 flex items-center gap-3">
          <button
            onClick={() => vote("up")}
            className={cn(
              "inline-flex items-center gap-1 text-sm rounded-md border px-2.5 py-1 transition-colors",
              viewerVote === "up"
                ? "border-upvote/50 text-upvote bg-upvote/10"
                : "border-hairline text-muted hover:text-paper"
            )}
          >
            <ArrowBigUp size={15} className={viewerVote === "up" ? "fill-upvote" : ""} />
            {upvotes}
          </button>
          <button
            onClick={() => vote("down")}
            className={cn(
              "inline-flex items-center gap-1 text-sm rounded-md border px-2.5 py-1 transition-colors",
              viewerVote === "down"
                ? "border-downvote/50 text-downvote bg-downvote/10"
                : "border-hairline text-muted hover:text-paper"
            )}
          >
            <ArrowBigDown size={15} className={viewerVote === "down" ? "fill-downvote" : ""} />
            {downvotes}
          </button>

          <div className="flex-1 h-1.5 rounded-full bg-surface-raised overflow-hidden">
            <div
              className={cn("h-full", upPercent >= 70 ? "bg-upvote" : "bg-ember-dim")}
              style={{ width: `${upPercent}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted shrink-0">{upPercent}%</span>

          {hoursLeft !== null && (
            <span className="inline-flex items-center gap-1 text-xs text-muted shrink-0">
              <Clock size={11} />
              {hoursLeft}h left
            </span>
          )}
        </div>
      )}
    </div>
  );
}
