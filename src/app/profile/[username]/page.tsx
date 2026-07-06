import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IdeaCard } from "@/components/ideas/idea-card";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { AvatarUploader } from "@/components/profile/avatar-uploader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username}` };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  // Fetch authenticated user to check ownership
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, bio")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const { data: authoredIdeas } = await supabase
    .from("ideas")
    .select()
    .eq("profile", profile.id);

  const ideas = authoredIdeas || [];
  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isOwnProfile ? (
            <AvatarUploader
              userId={profile.id}
              username={profile.username}
              avatarUrl={profile.avatar_url}
              size={64}
            />
          ) : (
            <Avatar
              username={profile.username}
              avatarUrl={profile.avatar_url}
              size={64}
            />
          )}
          <div>
            <h1 className="font-display text-2xl text-paper">
              @{profile.username}
            </h1>
            {profile.bio && (
              <p className="text-sm text-muted mt-1">{profile.bio}</p>
            )}
          </div>
        </div>
        {/* Log out button form (Only shown if viewing own profile) */}
        {isOwnProfile && (
          <form
            action={async () => {
              "use server";
              await signout();
            }}
          >
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        )}
      </div>
      <section className="mt-10">
        <h2 className="font-display text-lg text-paper mb-3">
          Ideas created
          <Badge tone="muted" className="ml-2">
            {ideas.length}
          </Badge>
        </h2>
        {ideas.length === 0 ? (
          <p className="text-sm text-muted">No ideas yet.</p>
        ) : (
          // @ts-ignore
          ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)
        )}
      </section>
    </div>
  );
}