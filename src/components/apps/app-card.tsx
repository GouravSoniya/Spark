import { ExternalLink, Box } from "lucide-react"; // Added Box as a fallback icon
import type { AppAttachment } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function AppCard({ app }: { app: AppAttachment }) {
  return (
    <div className="border border-hairline rounded-md p-4 bg-paper/5">
      <div className="flex items-start justify-between gap-3">
        {/* Left Side: Logo + Title/Description */}
        <div className="flex items-start gap-3">
          {/* App Logo */}
          <div className="w-12 h-12 rounded-lg border border-hairline overflow-hidden flex items-center justify-center bg-muted/10 shrink-0">
            {app.logo_url ? (
              <img 
                src={app.logo_url? app.logo_url : "public\Spark.png"} 
                alt={`${app.title} logo`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Box size={20} className="text-muted/60" /> // Fallback icon if logo_url is null
            )}
          </div>

          {/* Title & Description */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-display text-base text-paper font-medium">{app.title}</h4>
              <Badge tone="muted">v{app.ideaVersionAtAttach} at attach</Badge>
            </div>
            <p className="mt-1 text-sm text-muted line-clamp-2">{app.description}</p>
          </div>
        </div>

        {/* Right Side: Open Button */}
        <a
          href={app.app_link}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 text-xs text-ember border border-ember/40 rounded-md px-2.5 py-1.5 hover:bg-ember/10 transition-colors"
        >
          Open
          <ExternalLink size={11} />
        </a>
      </div>

      {/* Footer info */}
      <div className="mt-4 pt-3 border-t border-hairline/50 flex items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Avatar username={app.author?.username} avatarUrl={app.author?.avatar_url} size={16} />
          {app.author?.username}
        </span>
      </div>
    </div>
  );
}