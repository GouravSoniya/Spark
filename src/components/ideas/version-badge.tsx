import { EmberMark } from "./ember-mark";
import { cn } from "@/lib/utils";

export function VersionBadge({
  version,
  className,
}: {
  version: number | null;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <EmberMark version={version} size={16} />
      <span className="font-mono text-xs text-muted">v{version}</span>
    </span>
  );
}
