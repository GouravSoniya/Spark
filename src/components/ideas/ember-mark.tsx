import { cn } from "@/lib/utils";

/**
 * Signature element: a flame that literally grows and brightens with the
 * idea's version number. v1 is a small dim spark; a heavily-merged idea
 * (v5+) is a fuller, brighter flame. This maps directly to real data
 * (mergeCount / version), not decoration — it's how you'd recognize at a
 * glance how much collective work has gone into an idea.
 */
export function EmberMark({
  version,
  size = 20,
  className,
}: {
  version: number | null;
  size?: number;
  className?: string;
}) {
  const intensity = version ? Math.min(version / 6, 1) : 0; // 0 → 1
  const scale = 0.75 + intensity * 1.25; // 0.75 → 2
  const glow = 4 + intensity * 10;

  return (
    <span
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        width={size * scale}
        height={size * scale}
        style={{
          filter: `drop-shadow(0 0 ${glow}px color-mix(in srgb, var(--color-ember) ${40 + intensity * 40}%, transparent))`,
        }}
      >
        <path
          d="M12 2c1 3-2 4-2 7a4 4 0 1 0 8 0c0-1-.5-2-1-2 .3 1.5-.5 2.5-1.5 2.5C16.8 9.5 17 8 16 6c-1.3 3-3 2-3-1 0-1.3-.5-2.3-1-3Z"
          fill={intensity > 0.5 ? "var(--color-ember)" : "var(--color-amber)"}
          opacity={0.55 + intensity * 0.45}
        />
        <path
          d="M12 22a6 6 0 0 0 6-6c0-2.5-2-4-2-6.5 0 2-1.5 2.5-1.5 4.5 0-2-1.5-2.5-1.5-4.5-2 2-3 4.5-3 6.5a2 2 0 1 0 4 0c0-.8-.4-1.3-.8-1.8.4.2.8.7.8 1.3a6 6 0 0 0-2 6.5Z"
          fill="var(--color-ember)"
          opacity={0.85 + intensity * 0.15}
        />
      </svg>
    </span>
  );
}
