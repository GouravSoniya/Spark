import type { Metadata } from "next";
import { CreateIdeaWizard } from "@/components/ideas/create-idea-wizard";

export const metadata: Metadata = { title: "New idea" };

export default async function NewIdeaPage({
  searchParams,
}: {
  searchParams: Promise<{ seed?: string }>;
}) {
  const { seed } = await searchParams;
  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-20">
      <CreateIdeaWizard seed={seed} />
    </div>
  );
}
