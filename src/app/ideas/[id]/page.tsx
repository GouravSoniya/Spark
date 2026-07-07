import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { getIdea, getMergeRequests, getApps, getComments } from "@/lib/database";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VersionBadge } from "@/components/ideas/version-badge";
import { LikeButton } from "@/components/ideas/like-button";
import { MergeRequestCard } from "@/components/ideas/merge-request-card";
import { MergeRequestForm } from "@/components/ideas/merge-request-form";
import { AppCard } from "@/components/apps/app-card";
import { CommentSection } from "@/components/ideas/comment-section";
import { categoryLabel, timeAgo } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const idea = await getIdea(id);
  return { title: idea?.title ?? "Idea not found" };
}

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idea = await getIdea(id);
  if (!idea) notFound();

  const [mergeRequests, apps, comments] = await Promise.all([
    getMergeRequests(id),
    getApps(id),
    getComments(id),
  ]);

  const pending = mergeRequests.filter((m) => m.status === "pending");
  const resolved = mergeRequests.filter((m) => m.status !== "pending");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2 mb-4">
        <Badge tone="muted">{categoryLabel(idea.category)}</Badge>
        <VersionBadge version={idea.version} />
      </div>

      <h1 className="font-display text-3xl text-paper leading-tight">
        {idea.title}
      </h1>

      <div className="mt-4 flex items-center gap-3 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Avatar username={idea.author?.username} avatarUrl={idea.author?.avatar_url} size={22} />
          {idea.author?.username}
        </span>
        <span>{timeAgo(idea.createdAt || "")}</span>
      </div>

      <p className="mt-6 text-paper leading-relaxed whitespace-pre-line">
        {idea.description}
      </p>

      {/* {idea.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {idea.tags.map((tag) => (
            <span key={tag} className="text-xs font-mono text-ember/80">
              #{tag}
            </span>
          ))}
        </div>
      )} */}

      <div className="mt-6 flex items-center gap-3">
        <LikeButton
          ideaId={idea.id?.toString() || ""}
          initialLiked={idea.likedByViewer}
          initialCount={idea.likeCount}
        />
      </div>

      {/* Merge requests */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-paper">
            Merge requests
            {pending.length > 0 && (
              <span className="ml-2 text-sm font-sans font-normal text-muted">
                {pending.length} open for voting
              </span>
            )}
          </h2>
          <MergeRequestForm ideaId={idea.id||0} />
        </div>

        {mergeRequests.length === 0 ? (
          <p className="text-sm text-muted">
            No changes proposed yet. If this idea is missing something,
            propose a merge request above.
          </p>
        ) : (
          <div className="space-y-3">
            {[...pending, ...resolved].map((mr) => (
              <MergeRequestCard key={mr.id} mr={mr} />
            ))}
          </div>
        )}
      </section>

      {/* Attached apps */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-paper">
            Apps built for this idea
          </h2>
          <Button href={`/ideas/${idea.id}/apps/new`} variant="outline" size="sm">
            <Plus size={14} />
            Attach your app
          </Button>
        </div>

        {apps.length === 0 ? (
          <p className="text-sm text-muted">
            No apps attached yet — be the first to build this.
          </p>
        ) : (
          <div className="space-y-3">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </section>

      {/* Comments */}
      <section className="mt-12">
        <h2 className="font-display text-xl text-paper mb-4">
          Discussion
        </h2>
        <CommentSection parentId={idea.id?.toString() || ""} initialComments={comments} />
      </section>
    </div>
  );
}
