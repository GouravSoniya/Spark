"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Category, FeedSort } from "@/lib/types";
import { categoryLabel, cn } from "@/lib/utils";

const SORTS: { value: FeedSort; label: string }[] = [
  { value: "trending", label: "Trending" },
  { value: "popular", label: "Popular" },
  { value: "recent", label: "Recent" },
];

const CATEGORIES: Category[] = [
  "Productivity",
  "Developer-tools",
  "Health",
  "Finance",
  "Education",
  "Social",
  "Creative",
  "Commerce",
  "Other"
];

export function FeedTabs({
  activeSort,
  activeCategory,
}: {
  activeSort: FeedSort;
  activeCategory?: Category;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function buildHref(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1 border-b border-hairline">
        {SORTS.map((sort) => (
          <Link
            key={sort.value}
            href={buildHref({ sort: sort.value })}
            className={cn(
              "px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeSort === sort.value
                ? "border-ember text-paper"
                : "border-transparent text-muted hover:text-paper"
            )}
          >
            {sort.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref({ category: undefined })}
          className={cn(
            "text-xs font-mono px-2.5 py-1 rounded-full border transition-colors",
            !activeCategory
              ? "border-ember text-ember bg-ember/10"
              : "border-hairline text-muted hover:text-paper"
          )}
        >
          All
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={buildHref({ category: cat })}
            className={cn(
              "text-xs font-mono px-2.5 py-1 rounded-full border transition-colors",
              activeCategory === cat
                ? "border-ember text-ember bg-ember/10"
                : "border-hairline text-muted hover:text-paper"
            )}
          >
            {categoryLabel(cat)}
          </Link>
        ))}
      </div>
    </div>
  );
}
