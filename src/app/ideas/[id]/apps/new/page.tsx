import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getIdea } from "@/lib/database";
import { AttachAppForm } from "@/components/apps/attach-app-form";

export const metadata: Metadata = { title: "Attach your app" };

export default async function AttachAppPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idea = await getIdea(id);
  if (!idea) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="text-xs font-mono text-muted mb-1">ATTACHING TO</p>
      <h1 className="font-display text-2xl italic text-paper mb-1">
        {idea.title}
      </h1>
      <p className="text-sm text-muted mb-8">
        Your app will be linked at v{idea.version} of this idea.
      </p>
      <AttachAppForm ideaId={parseInt(id)} />
    </div>
  );
}
