"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmberMark } from "@/components/ideas/ember-mark";
import {
  getClarifyingQuestions,
  generateStarterIdea,
  publishIdea,
  type GeneratedIdea,
} from "@/lib/actions/create-idea";

type Step = "seed" | "questions" | "review" | "publishing";

export function CreateIdeaWizard({ seed = "" }: { seed?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("seed");
  const [vagueDescription, setVagueDescription] = useState(seed);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState<GeneratedIdea | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSeedSubmit() {
    if (!vagueDescription.trim()) return;
    setLoading(true);
    const qs = await getClarifyingQuestions(vagueDescription);
    setQuestions(qs);
    setLoading(false);
    setStep("questions");
  }

  async function handleQuestionsSubmit() {
    setLoading(true);
    const idea = await generateStarterIdea({ vagueDescription, answers });
    setGenerated(idea);
    setLoading(false);
    setStep("review");
  }

  async function handlePublish() {
    if (!generated) return;
    setStep("publishing");
    const result = await publishIdea(generated);
    if (result.ok) router.push(`/ideas/${result.id}`);
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-8 text-xs font-mono text-muted">
        <Sparkles size={13} className="text-ember" />
        AI PRODUCT MANAGER
        <span className="text-hairline">·</span>
        <StepIndicator step={step} />
      </div>

      {step === "seed" && (
        <div>
          <h1 className="font-display text-2xl italic text-paper mb-1">
            What's the idea, roughly?
          </h1>
          <p className="text-sm text-muted mb-6">
            Don't worry about making it precise — just describe the problem
            or gap. A few questions will sharpen it from here.
          </p>
          <Textarea
            autoFocus
            value={vagueDescription}
            onChange={(e) => setVagueDescription(e.target.value)}
            placeholder="e.g. Something that helps roommates split bills fairly when incomes are really different..."
            className="min-h-32"
          />
          <Button
            onClick={handleSeedSubmit}
            disabled={!vagueDescription.trim() || loading}
            className="mt-5"
          >
            {loading ? "Thinking…" : "Continue"}
            <ArrowRight size={15} />
          </Button>
        </div>
      )}

      {step === "questions" && (
        <div className="space-y-6">
          <h1 className="font-display text-2xl italic text-paper mb-1">
            A few quick questions
          </h1>
          <p className="text-sm text-muted mb-2">
            These help write a clean, actionable version other people can
            actually contribute to.
          </p>
          {questions.map((q, i) => (
            <div key={i}>
              <label className="block text-sm text-paper mb-2">{q}</label>
              <Textarea
                value={answers[q] ?? ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [q]: e.target.value }))
                }
                className="min-h-20"
              />
            </div>
          ))}
          <Button
            onClick={handleQuestionsSubmit}
            disabled={loading || Object.keys(answers).length < questions.length}
          >
            {loading ? "Writing your idea…" : "Generate idea"}
            <ArrowRight size={15} />
          </Button>
        </div>
      )}

      {step === "review" && generated && (
        <div>
          <h1 className="font-display text-2xl italic text-paper mb-1">
            Here's the starter version
          </h1>
          <p className="text-sm text-muted mb-6">
            This becomes v1. Anyone can propose changes from here — the idea
            keeps evolving through merge requests.
          </p>

          <div className="border border-hairline rounded-md p-6 bg-surface">
            <div className="flex items-center gap-2 mb-3">
              <EmberMark version={1} size={16} />
              <span className="font-mono text-xs text-muted">v1</span>
            </div>
            <h2 className="font-display text-xl text-paper mb-2">
              {generated.title}
            </h2>
            <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
              {generated.description}
            </p>
          </div>

          <div className="flex gap-3 mt-5">
            <Button onClick={handlePublish}>Publish idea</Button>
            <Button variant="ghost" onClick={() => setStep("questions")}>
              Go back
            </Button>
          </div>
        </div>
      )}

      {step === "publishing" && (
        <div className="py-16 text-center">
          <EmberMark version={1} size={28} className="mx-auto mb-3" />
          <p className="font-mono text-sm text-muted">Publishing…</p>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const labels: Record<Step, string> = {
    seed: "Step 1 of 3",
    questions: "Step 2 of 3",
    review: "Step 3 of 3",
    publishing: "Publishing",
  };
  return <span>{labels[step]}</span>;
}
