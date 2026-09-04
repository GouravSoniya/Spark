"use client";

import Link from "next/link";
import { Heart, MessageSquare, GitMerge } from "lucide-react";
import type { Idea } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VersionBadge } from "./version-badge";
import { categoryLabel, formatCount, timeAgo } from "@/lib/utils";
import { useNavigationProgress } from "@/lib/navigation-progress";

export function IdeaCard({ idea }: { idea: Idea }) {
  const { navigate } = useNavigationProgress();
  const href = `/ideas/${idea.id}`;

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks (new tab, new window, etc.) behave natively
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    navigate(href);
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="group block border-b border-hairline py-6 first:pt-0 transition-colors hover:bg-surface/40 active:bg-surface/40 -mx-4 px-4 rounded-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge tone="muted">{categoryLabel(idea.category)}</Badge>
            <VersionBadge version={idea.version} />
          </div>

          <h3 className="font-display text-xl text-paper leading-snug group-hover:text-ember group-active:text-ember transition-colors">
            {idea.title}
          </h3>

          <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-2">
            {idea.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Avatar username={idea.author?.username} avatarUrl={idea.author?.avatar_url} size={18} />
              {idea.author?.username}
            </span>
            <span>{timeAgo(idea.createdAt || "")}</span>
            <span className="inline-flex items-center gap-1">
              <Heart size={13} className={idea.likedByViewer ? "fill-ember text-ember" : ""} />
              {formatCount(idea.likeCount)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare size={13} />
              {formatCount(idea.commentCount || 0)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}