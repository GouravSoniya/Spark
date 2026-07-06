import type { Metadata } from "next";
import { SearchExperience } from "@/components/search/search-experience";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-10">
      <h1 className="font-display text-2xl italic text-paper mb-1">
        What's the gap you keep running into?
      </h1>
      <p className="text-sm text-muted mb-8">
        Search first — it saves you from creating a duplicate, and might
        point you to an app you can start using today.
      </p>
      <SearchExperience />
    </div>
  );
}
