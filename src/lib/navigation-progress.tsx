"use client";

import {
  createContext,
  useContext,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

const NavigationProgressContext = createContext<{
  isPending: boolean;
  navigate: (href: string) => void;
} | null>(null);

export function NavigationProgressProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function navigate(href: string) {
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <NavigationProgressContext.Provider value={{ isPending, navigate }}>
      {children}
      <NavigationProgressBar isPending={isPending} />
    </NavigationProgressContext.Provider>
  );
}

export function useNavigationProgress() {
  const ctx = useContext(NavigationProgressContext);
  if (!ctx) {
    throw new Error(
      "useNavigationProgress must be used within a NavigationProgressProvider"
    );
  }
  return ctx;
}

function NavigationProgressBar({ isPending }: { isPending: boolean }) {
  if (!isPending) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-[2px]"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 rounded-md bg-surface-raised border border-hairline px-6 py-5 shadow-lg">
        <div className="relative h-1 w-40 overflow-hidden rounded-full bg-surface">
          <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-ember shadow-[0_0_8px_var(--color-ember)] animate-loading-slide" />
        </div>
        <p className="font-mono text-xs text-muted tracking-wide">
          Loading idea…
        </p>
      </div>
    </div>
  );
}