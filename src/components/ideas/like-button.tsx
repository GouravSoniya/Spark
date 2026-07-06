"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { likeIdea, unlikeIdea } from "@/lib/actions/ideas";
import { cn, formatCount } from "@/lib/utils";

export function LikeButton({
  ideaId,
  initialLiked,
  initialCount,
}: {
  ideaId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    startTransition(async () => {
      const result = next ? await likeIdea(ideaId) : await unlikeIdea(ideaId);
      // if (result.error) {
      //   // roll back optimistic update on failure
      //   setLiked(!next);
      //   setCount((c) => c + (next ? -1 : 1));
      // }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors",
        liked
          ? "border-ember/50 text-ember bg-ember/10"
          : "border-hairline text-muted hover:text-paper"
      )}
    >
      <Heart size={15} className={liked ? "fill-ember" : ""} />
      {formatCount(count)}
    </button>
  );
}
