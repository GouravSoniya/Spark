"use client";

import { useEffect, useState, useTransition } from "react";
import { Search as SearchIcon } from "lucide-react";
import { searchIdeas } from "@/lib/database";
import type { Idea } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { IdeaCard } from "@/components/ideas/idea-card";
import { Button } from "@/components/ui/button";

export function SearchExperience() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Idea[]>([]);
  const [searched, setSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    const timeout = setTimeout(() => {
      startTransition(async () => {
        const r = await searchIdeas(query);
        setResults(r);
        setSearched(true);
      });
    }, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div>
      <div className="relative">
        <SearchIcon
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe the idea you have in mind…"
          className="pl-11 py-3.5 text-base"
        />
      </div>

      <div className="mt-8">
        {!searched && !isPending && (
          <p className="text-sm text-muted">
            We search by meaning, not just keywords — describe the problem,
            not just a product name. If something similar already exists,
            you're better off strengthening it than starting from scratch.
          </p>
        )}

        {isPending && (
          <p className="text-sm text-muted font-mono">Searching…</p>
        )}

        {searched && !isPending && results.length > 0 && (
          <div>
            <p className="text-sm text-muted mb-4">
              Found {results.length} idea{results.length === 1 ? "" : "s"}{" "}
              close to that. Try one of these before creating a new one:
            </p>
            {results.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}

        {searched && !isPending && results.length === 0 && (
          <div className="border border-dashed border-hairline rounded-md p-8 text-center">
            <p className="font-display text-lg text-paper">
              Nothing close to that yet.
            </p>
            <p className="mt-1.5 text-sm text-muted max-w-sm mx-auto">
              Looks like this gap hasn't been posted. Let's turn it into a
              proper idea — our AI will ask a few questions to sharpen it.
            </p>
            <Button
              href={`/ideas/new?seed=${encodeURIComponent(query)}`}
              className="mt-5"
            >
              Create this idea
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
