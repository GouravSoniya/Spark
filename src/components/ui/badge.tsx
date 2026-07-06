import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "ember" | "muted";
}) {
  const tones = {
    default: "border-hairline text-paper",
    ember: "border-ember/40 text-ember bg-ember/10",
    muted: "border-hairline text-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
