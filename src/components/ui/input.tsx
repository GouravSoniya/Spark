import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-md bg-surface border border-hairline px-3.5 py-2.5 text-paper placeholder:text-muted outline-none focus-visible:border-ember transition-colors",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-md bg-surface border border-hairline px-3.5 py-2.5 text-paper placeholder:text-muted outline-none focus-visible:border-ember transition-colors resize-y min-h-24",
        className
      )}
      {...props}
    />
  );
}
