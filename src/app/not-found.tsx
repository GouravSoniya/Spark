import { EmberMark } from "@/components/ideas/ember-mark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-sm px-4 pt-24 text-center">
      <EmberMark version={0} size={32} className="mx-auto mb-4 opacity-50" />
      <h1 className="font-display text-2xl italic text-paper">
        Nothing here yet.
      </h1>
      <p className="mt-2 text-sm text-muted">
        This idea or page doesn't exist — or was never sparked.
      </p>
      <Button href="/" variant="outline" className="mt-6">
        Back to the feed
      </Button>
    </div>
  );
}
