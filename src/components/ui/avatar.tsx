import Image from "next/image";
import { cn } from "@/lib/utils";

export function Avatar({
  username,
  avatarUrl,
  size = 32,
  className,
}: {
  username?: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={username || "User avatar"}
        width={size}
        height={size}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  const initial = username?.charAt(0).toUpperCase();
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      className={cn(
        "rounded-full bg-surface-raised border border-hairline flex items-center justify-center font-display text-amber shrink-0",
        className
      )}
      aria-hidden
    >
      {initial}
    </div>
  );
}
