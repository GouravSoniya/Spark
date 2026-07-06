import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmberMark } from "@/components/ideas/ember-mark";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the username from the profiles table if a user is logged in
  let username = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    
    username = profile?.username;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-ink/85 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <EmberMark version={6} size={22} />
          <span className="font-display text-lg tracking-tight">Spark</span>
        </Link>

        <Link
          href="/search"
          className="flex-1 max-w-sm hidden sm:flex items-center gap-2 text-sm text-muted border border-hairline rounded-md px-3.5 py-2 hover:border-ember/50 transition-colors"
        >
          <Search size={15} />
          Search ideas before you create one
        </Link>

        <nav className="flex items-center gap-2 shrink-0">
          <Button href="/search" variant="ghost" size="sm" className="sm:hidden">
            <Search size={16} />
          </Button>
          
          {user ? (
            // Profile button routing to /profile/[username] (fallback to id if username is missing)
            <Button href={`/profile/${username || user.id}`} variant="ghost" size="sm">
              Profile
            </Button>
          ) : (
            <Button href="/login" variant="ghost" size="sm">
              Log in
            </Button>
          )}
          
          <Button href="/ideas/new" variant="primary" size="sm">
            New idea
          </Button>
        </nav>
      </div>
    </header>
  );
}