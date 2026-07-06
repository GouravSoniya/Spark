"use server";
import { createClient } from "./supabase/server";
import type {
  AppAttachment,
  Comment,
  FeedFilters,
  Idea,
  MergeRequest,
  Profile,
} from "./types";

const authors: Record<string, Idea["author"]> = {
  aarav: { id: "u1", username: "aarav_builds", avatar_url: null },
  meera: { id: "u2", username: "meera.codes", avatar_url: null },
  rohan: { id: "u3", username: "rohan_ships", avatar_url: null },
  priya: { id: "u4", username: "priya_pm", avatar_url: null },
};

// export const MOCK_IDEAS: Idea[] = [
//   {
//     id: "idea-1",
//     title: "Split rent & bills fairly for mismatched roommate incomes",
//     description:
//       "A shared-expense tracker that splits rent and bills proportionally to each roommate's income instead of evenly, with monthly settle-up reminders and a simple dispute log. Aimed at Indian flatshares where incomes vary a lot between roommates.",
//     category: "Finance",
//     version: 4,
//     likeCount: 812,
//     commentCount: 47,
//     mergeCount: 3,
//     createdAt: "2026-05-02T10:00:00.000Z",
//     updatedAt: "2026-06-20T08:00:00.000Z",
//     author: authors.meera,
//     likedByViewer: false,
//   },
//   {
//     id: "idea-2",
//     title: "Attendance-linked doubt-clearing queue for tier-3 college classrooms",
//     description:
//       "A lightweight queue where students post doubts during or after lecture, ranked by how many classmates have the same doubt, so professors address the highest-impact questions first instead of whoever raises a hand.",
//     category: "Education",
//     version: 2,
//     likeCount: 341,
//     commentCount: 19,
//     mergeCount: 1,
//     createdAt: "2026-06-10T12:00:00.000Z",
//     updatedAt: "2026-06-25T09:00:00.000Z",
//     author: authors.rohan,
//     likedByViewer: true,
//   },
//   {
//     id: "idea-3",
//     title: "Merge-conflict-free changelog generator for solo indie devs",
//     description:
//       "Watches your commit messages and auto-drafts a plain-English changelog entry per release, so solo developers shipping fast don't have to context-switch into writing release notes by hand.",
//     category: "Developer-tools",
//     version: 6,
//     likeCount: 1290,
//     commentCount: 88,
//     mergeCount: 5,
//     createdAt: "2026-04-18T12:00:00.000Z",
//     updatedAt: "2026-06-28T12:00:00.000Z",
//     author: authors.aarav,
//     likedByViewer: false,
//   },
//   {
//     id: "idea-4",
//     title: "Medication reminders that adapt to shift-worker sleep schedules",
//     description:
//       "Most medication reminder apps assume a 9-to-5 sleep cycle. This one lets shift workers (nurses, factory workers) set rotating schedules and adjusts dosage timing windows accordingly, flagging when a dose is at risk of being missed.",
//     category: "Health",
//     version: 1,
//     likeCount: 156,
//     commentCount: 8,
//     mergeCount: 0,
//     createdAt: "2026-06-27T12:00:00.000Z",
//     updatedAt: "2026-06-27T12:00:00.000Z",
//     author: authors.priya,
//     likedByViewer: false,
//   },
//   {
//     id: "idea-5",
//     title: "Portfolio-project tracker that matches your build to hiring signals",
//     description:
//       "For students building portfolio projects to land a job: paste a target job description and the tool maps which of your existing projects (or gaps) actually match what the role is testing for, instead of guessing what to build next.",
//     category: "Productivity",
//     version: 3,
//     likeCount: 674,
//     commentCount: 52,
//     mergeCount: 2,
//     createdAt: "2026-05-22T12:00:00.000Z",
//     updatedAt: "2026-06-29T12:00:00.000Z",
//     author: authors.rohan,
//     likedByViewer: false,
//   },
// ];

// export const MOCK_MERGE_REQUESTS: Record<string, MergeRequest[]> = {
//   "idea-1": [
//     {
//       id: "mr-1",
//       idea_id: 1,
//       merge_content:
//         "Add a 'guest expense' mode for one-off shared costs (like a birthday dinner) that shouldn't count toward the monthly income-weighted split.",
//       status: "pending",
//       upvotes: 34,
//       downvotes: 6,
//       created_at: "2026-06-29T10:00:00.000Z",
//       expires_at: "2026-07-01T10:00:00.000Z",
//       author: authors.aarav,
//       viewerVote: null,
//     },
//     {
//       id: "mr-2",
//       idea_id: 1,
//       merge_content:
//         "Support UPI autopay reminders instead of just push notifications, since most flatmates settle via UPI directly.",
//       status: "merged",
//       upvotes: 61,
//       downvotes: 2,
//       created_at: "2026-06-15T10:00:00.000Z",
//       expires_at: "2026-06-17T10:00:00.000Z",
//       author: authors.priya,
//       viewerVote: "up",
//     },
//   ],
// };

// export const MOCK_APPS: Record<string, AppAttachment[]> = {
//   "idea-1": [
//     {
//       id: 1,
//       idea_id: 1,
//       title: "SplitFair",
//       description: "Income-weighted rent splitting with UPI settle-up links.",
//       app_link: "https://github.com/example/splitfair",
//       ideaVersionAtAttach: 3,
//       like_count: 98,
//       comment_count: 14,
//       created_at: "2026-06-05T10:00:00.000Z",
//       author: authors.rohan,
//     },
//   ],
// };

// export const MOCK_COMMENTS: Record<string, Comment[]> = {
//   "idea-1": [
//     {
//       id: "c-1",
//       parentType: "idea",
//       parentId: "idea-1",
//       body: "This would've saved so many arguments in my last flat. The proportional split is the key insight here.",
//       createdAt: "2026-06-21T10:00:00.000Z",
//       author: authors.priya,
//     },
//   ],
// };

// const MOCK_PROFILES: Record<string, Profile> = {
//   aarav_builds: {
//     id: "u1",
//     username: "aarav_builds",
//     avatar_url: null,
//     bio: "BCA student, shipping small tools between classes.",
//     created_at: "2026-01-10T00:00:00.000Z",
//   },
// };

// ---------------------------------------------------------------------------
// Data-access functions — swap the body for a real Supabase call later.
// ---------------------------------------------------------------------------


// export async function getFeedIdeas(filters: FeedFilters): Promise<Idea[]> {
//   const supabase = await createClient();
  
//   // 1. Handle "trending" via RPC
//   if (filters.sort === "trending") {
//     let { data, error } = await supabase.rpc('get_trending_ideas', { 
//       page_number: 1, 
//       page_size: 10 
//     });
//     if (error) throw error.message;
//     // Filter the array directly in JS
//     if (filters.category && data) {
//       data = data.filter((item: any) => item.category === filters.category);
//     }
//     return data as Idea[];
//   }
  
//   let query = supabase
//   .from("ideas")
//   .select(`
//     *,
//     profile:profile (
//       username
//     )
//   `);

//   // 2. Handle standard queries ("popular" or "recent")
  
//   if (filters.category) {
//     query = query.eq("category", filters.category);
//   }
  
//   if (filters.sort === "popular") {
//     query = query.order("likeCount", { ascending: false });
//   } else if (filters.sort === "recent") {
//     query = query.order("createdAt", { ascending: false });
//   }

//   const { data, error } = await query;
//   if (error) throw error;
//   return data as Idea[];
// }


// export async function getFeedIdeas(filters: FeedFilters): Promise<Idea[]> {
//   const supabase = await createClient();
  
//   // 1. Fetch the current logged-in user's ID
//   const { data: { user } } = await supabase.auth.getUser();
//   const currentUserId = user?.id;

//   // ----------------------------------------------------------------
//   // PATH A: Handle "trending" via RPC
//   // ----------------------------------------------------------------
//   if (filters.sort === "trending") {
//     let { data, error } = await supabase.rpc('get_trending_ideas', { 
//       page_number: 1, 
//       page_size: 10 
//     });
    
//     if (error) throw error.message;

//     // Filter by category in JS if needed
//     if (filters.category && data) {
//       data = data.filter((item: any) => item.category === filters.category);
//     }

//     if (!data || data.length === 0) return [];

//     // If no user is logged in, likedByViewer is always false
//     if (!currentUserId) {
//       return data.map((item: any) => ({ ...item, likedByViewer: false })) as Idea[];
//     }

//     // Fetch what this user liked out of the returned trending ideas
//     const trendingIds = data.map((item: any) => item.id);
//     const { data: userLikes } = await supabase
//       .from('idea_likes')
//       .select('idea_id')
//       .eq('user_id', currentUserId)
//       .in('idea_id', trendingIds);

//     const likedSet = new Set(userLikes?.map(like => like.idea_id));

//     // Map and inject likedByViewer
//     return data.map((item: any) => ({
//       ...item,
//       likedByViewer: likedSet.has(item.id)
//     })) as Idea[];
//   }
  
//   // ----------------------------------------------------------------
//   // PATH B: Handle standard queries ("popular" or "recent")
//   // ----------------------------------------------------------------
//   let query = supabase
//     .from("ideas")
//     .select(`
//       *,
//       profile:profile (
//         username
//       ),
//       likedByViewer:idea_likes!left(count)
//     `)
//     // Look for likes belonging strictly to the current viewer
//     .eq('idea_likes.user_id', currentUserId || '00000000-0000-0000-0000-000000000000'); 
//     // Fallback UUID ensures the subquery returns 0 count when user is logged out

//   if (filters.category) {
//     query = query.eq("category", filters.category);
//   }
  
//   if (filters.sort === "popular") {
//     query = query.order("likeCount", { ascending: false });
//   } else if (filters.sort === "recent") {
//     query = query.order("createdAt", { ascending: false });
//   }

//   const { data, error } = await query;
//   if (error) throw error;

//   // Format standard query data to match your Idea[] interface
//   return data.map((idea: any) => ({
//     ...idea,
//     likedByViewer: idea.likedByViewer?.[0]?.count > 0
//   })) as Idea[];
// }

export async function getFeedIdeas(filters: FeedFilters): Promise<Idea[]> {
  const supabase = await createClient();
  
  // 1. Get the current user
  
  const { data: { user }, error } = await supabase.auth.getUser();
  const currentUserId = user?.id;

  let rawIdeas: any[] = [];

  // ----------------------------------------------------------------
  // FETCH DATA PATH A: Trending (RPC)
  // ----------------------------------------------------------------
  if (filters.sort === "trending") {
    const { data, error } = await supabase.rpc('get_trending_ideas', { 
      page_number: 1, 
      page_size: 10 
    });
    if (error) throw error.message;
    rawIdeas = data || [];

    // Filter by category in JS if requested
    if (filters.category && rawIdeas.length > 0) {
      rawIdeas = rawIdeas.filter((item: any) => item.category === filters.category);
    }
  } 
  // ----------------------------------------------------------------
  // FETCH DATA PATH B: Standard (Popular / Recent)
  // ----------------------------------------------------------------
  else {
    let query = supabase
      .from("ideas")
      .select(`
        *,
        author:profile (
          username,
          avatar_url
        )
      `);

    if (filters.category) {
      query = query.eq("category", filters.category);
    }
    
    if (filters.sort === "popular") {
      query = query.order("likeCount", { ascending: false });
    } else if (filters.sort === "recent") {
      query = query.order("createdAt", { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    rawIdeas = data || [];
  }

  // ----------------------------------------------------------------
  // CORE FIX: In-Memory "likedByViewer" Matching
  // ----------------------------------------------------------------
  
  // If no ideas returned, or no user logged in, wrap up early
  if (rawIdeas.length === 0) return [];
  if (!currentUserId) {
    return rawIdeas.map(idea => ({ ...idea, likedByViewer: false })) as Idea[];
  }

  // Extract all idea IDs from the fetched batch
  const ideaIds = rawIdeas.map(idea => idea.id);

  // Fetch only the likes that match THIS user AND these specific ideas
  const { data: userLikes, error: likesError } = await supabase
    .from('idea_likes')
    .select('idea_id')
    .eq('user_id', currentUserId)
    .in('idea_id', ideaIds);

  if (likesError) {
    console.error("Error fetching user likes:", likesError);
  }

  // Map likes to a Set for ultra-fast lookup: Set structure -> O(1)
  const likedIdeaIdsSet = new Set(userLikes?.map(like => like.idea_id));

  // Merge the boolean back into the original array
  return rawIdeas.map((idea) => ({
    ...idea,
    likedByViewer: likedIdeaIdsSet.has(idea.id)
  })) as Idea[];
}

export async function getIdea(id: string): Promise<Idea | null> {
  // Real version:
  const supabase = await createClient();
  const { data: { user }} = await supabase.auth.getUser();
  const currentUserId = user?.id;
  const { data, error } = await supabase.from("ideas").select(`
    *,
    author:profile (
      id,
      username,
      avatar_url
    )
  `).eq("id", id).single();
  if (error) throw error;
  if (!currentUserId) return { ...data, likedByViewer: false };

  // 2. Check if a like entry exists
  const { data: like } = await supabase
    .from('idea_likes')
    .select('id')
    .eq('user_id', currentUserId)
    .eq('idea_id', id)
    .maybeSingle(); // Returns null instead of throwing an error if row doesn't exist

  return {
    ...data,
    likedByViewer: !!like
  } as Idea | null;
}

export async function getMergeRequests(ideaId: string): Promise<MergeRequest[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id;

  const { data, error } = await supabase
    .from("pending_merges")
    .select(`
      *,
      author : requested_by ( id, username, avatar_url )
    `)
    .eq("idea", ideaId)
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    if (error) console.error(error);
    return [];
  }

  // 1. Safe Check: If no logged-in user, return early with viewerVote as null
  if (!currentUserId) {
    return data.map((row) => ({
      ...row,
      viewerVote: null
    })) as MergeRequest[];
  }

  // 2. Fetch the current user's votes safely
  const mergeRequestIds = data.map(mr => mr.id);
  const { data: votes, error: voteError } = await supabase
    .from('merge_votes')
    .select('merge_id, vote_type')
    .eq('user_id', currentUserId)
    .in('merge_id', mergeRequestIds);

  if (voteError) {
    console.error(voteError);
  }

  // 3. Map votes for O(1) lookups
  const voteMap = new Map<string, string>(
    votes?.map(v => [v.merge_id, v.vote_type]) || []
  );

  return data.map((row) => ({
    ...row,
    viewerVote: voteMap.get(row.id) || null
  })) as MergeRequest[];
}

export async function getApps(ideaId: string): Promise<AppAttachment[]> {
    const supabase = await createClient();

  const { data, error } = await supabase
    .from("apps")
    .select(`
      *,
      author:profile ( id, username, avatar_url )
    `)
    .eq("idea", ideaId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(error);
    return [];
  }

  return data.map((row: any) => ({
    ...row,
  })) as AppAttachment[];
}

export async function getComments(
  parentId: string
): Promise<Comment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("idea_comments")
    .select(`
      id,
      content,
      created_at,
      author:user_id ( id, username, avatar_url )
    `)
    .eq("idea_id", parentId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(error);
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    content: row.content,
    created_at: row.created_at,
    user_id : row.author.id,
    author: {
      id: row.author.id,
      username: row.author.username,
      avatar_url: row.author.avatar_url ?? null,
    },
  })) as Comment[];
}

export async function searchIdeas(query: string): Promise<Idea[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke('semantic-search', {
      body: { query: query }
  })
  if (error) throw error;
  return data as Idea[];
}

// export async function getProfile(username: string): Promise<Profile | null> {
//   return MOCK_PROFILES[username] ?? null;
// }
