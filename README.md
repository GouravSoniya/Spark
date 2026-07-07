# Spark — frontend

Next.js 16 (App Router) frontend for Spark, deployed on Vercel. Built against
mock data so it runs standalone right now — every place it needs your
Supabase backend is marked and isolated.

## Run it

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

Nothing will break with empty/placeholder env vars — the app reads from
`src/lib/database.ts` until you wire real queries in.

## Where your backend plugs in

This mirrors the frontend/backend split we planned: Next.js owns anything
scoped to the logged-in user's own request (protected by RLS), your Edge
Functions own anything triggered by a timer or webhook.

| File | What to do |
|---|---|
| `src/lib/database.ts` | Replace each function body with the real Supabase query (the real query is sketched in a comment above each one). Keep the same return shape and every component keeps working unchanged. |
| `src/lib/actions/ideas.ts` | Server Actions for like/unlike, comment, raise + vote on merge requests. Uncomment the Supabase calls once tables + RLS exist. |
| `src/lib/actions/create-idea.ts` | The AI "Product Manager" flow (clarifying questions → generated idea). Swap the stubbed logic for real calls to your AI provider. |
| `src/lib/actions/attach-app.ts` | Creates the Dodo checkout session. The **actual** app-attachment insert should happen in your `dodo-webhook` Edge Function on payment confirmation — never trust the client redirect alone. |
| `src/lib/supabase/client.ts` / `server.ts` | Already wired to `@supabase/ssr` correctly for the App Router (browser client vs. per-request server client). No changes needed, just add env vars. |
| `src/proxy.ts` | Refreshes the auth session cookie on every request. No changes needed. |

## Structure

```
src/
  app/                    routes (App Router)
    page.tsx              home feed (trending/popular/recent + filters)
    search/                semantic search entry point
    ideas/new/              AI-guided idea creation wizard
    ideas/[id]/              idea detail: description, merge requests, apps, comments
    ideas/[id]/apps/new/      attach-app + payment flow
    profile/[username]/      profile, badges, authored ideas
    login/, signup/          auth forms (submit handlers are stubbed)
  components/
    ui/                    Button, Input, Badge, Avatar — design primitives
    layout/                Navbar, Footer
    ideas/                 IdeaCard, EmberMark, MergeRequestCard, CommentSection, etc.
    apps/                  AppCard, AttachAppForm
    search/                SearchExperience
  lib/
    types.ts               shared types — keep in sync with your Postgres schema
    database.ts            data-access layer (swap for real queries)
    actions/                Server Actions (the seam to your backend)
    supabase/               browser + server Supabase clients
```

## Design notes

- Palette and type scale live in `src/app/globals.css` as Tailwind v4
  `@theme` tokens (`--color-ember`, `--font-display`, etc.) — change them
  there and they propagate everywhere.
- The ember mark (`components/ideas/ember-mark.tsx`) is the one
  signature visual element: it grows and brightens with an idea's
  version number, since that's real data (merge history), not decoration.
- Fraunces (display) + Inter (body) + IBM Plex Mono (versions, counts,
  timestamps) — the mono face is used specifically anywhere the number
  itself matters, echoing the git-like versioning of ideas.
