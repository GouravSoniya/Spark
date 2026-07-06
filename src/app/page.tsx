import { Suspense } from "react";
import { getFeedIdeas } from "@/lib/mock-data";
import { IdeaCard } from "@/components/ideas/idea-card";
import { FeedTabs } from "@/components/ideas/feed-tabs";
import type { Category, FeedSort } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function Feed({
  sort,
  category,
}: {
  sort: FeedSort;
  category?: Category;
}) {
  const ideas = await getFeedIdeas({ sort, category });

  if (ideas.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-lg text-paper">No ideas here yet.</p>
        <p className="mt-1.5 text-sm text-muted">
          Be the first to post one for this category.
        </p>
      </div>
    );
  }

  // Log the profile field to see its structure
  return (
    <div>
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string }>;
}) {
  const params = await searchParams;
  const sort = (params.sort as FeedSort) ?? "trending";
  const category = params.category as Category | undefined;
  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="pt-10 pb-8 border-b border-hairline">
        <h1 className="font-display text-3xl sm:text-4xl italic text-paper">
          Ideas worth building.
        </h1>
        <p className="mt-2 text-muted max-w-lg">
          Posted by people who felt the gap, shaped by everyone who's hit it
          too. Find one worth building, or contribute to make it sharper.
        </p>
      </div>

      <div className="py-6">
        <FeedTabs activeSort={sort} activeCategory={category} />
      </div>

      <Suspense fallback={<FeedSkeleton />}>
        <Feed sort={sort} category={category} />
      </Suspense>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-28 rounded-md bg-surface animate-pulse" />
      ))}
    </div>
  );
}
