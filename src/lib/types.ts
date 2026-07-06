import { Tables, Database } from "./database.types";

// 1. Enums & Filter Types (Kept from AI since they are frontend specific)
export type Category =
  | "Productivity"
  | "Developer-tools"
  | "Health"
  | "Finance"
  | "Education"
  | "Social"
  | "Creative"
  | "Commerce"
  | "Other";

export type FeedSort = "trending" | "popular" | "recent";

export interface FeedFilters {
  sort: FeedSort;
  category?: Category;
  tag?: string;
}

export type MergeRequestStatus = "pending" | "accepted" | "rejected" | "merged";

// 2. Exact Database Mappings (Overriding AI guesses with real schema)

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string | null; // DB uses snake_case 'created_at'
  bio?: string | null;       // Keeping as optional since it's not in your current DB profiles table
}

export interface Idea {
  id?: number | 0;                // DB uses number, AI guessed string
  title: string;
  description: string;
  category: string;   // Stored as string in DB
  version: number;
  likeCount: number;         // DB uses camelCase 'likeCount'
  commentCount?: number | 0; // DB uses camelCase 'commentCount'
  createdAt?: string | "";  // DB uses camelCase 'createdAt'
  profile: string;    // Stored as user ID string in DB relation
  
  // Frontend UI-specific fields (Kept for compatibility)
  likedByViewer: boolean | false;
  author?: Pick<Profile, "id" | "username" | "avatar_url">; 
}

export interface MergeRequest {
  id: string;
  idea: number;           // DB name & type: idea_id (number)
  merge_content: string;     // DB name: merge_content instead of proposal
  status: string;            // DB uses plain string
  upvotes: number;
  downvotes: number;
  created_at: string;        // DB name: created_at
  expires_at: string;        // DB name: expires_at instead of votingClosesAt
  requested_by: string | null; // DB user relationship field
  
  // Frontend compatibility
  viewerVote?: "up" | "down" | null;
  author?: Pick<Profile, "id" | "username" | "avatar_url">;
}

// Maps directly to your 'apps' table
export interface AppAttachment {
  id?: number;                // DB uses number
  idea: number | null;    // DB name & type: idea_id (number)
  title: string;
  profile: string | null;    // DB name & type: profile_id (string)
  description: string | null;
  app_link: string;          // DB name: app_link instead of link
  logo_url: string | null; 
  like_count?: number;
  created_at?: string | null;
  ideaVersionAtAttach: number | null; // DB name: idea_version_at_attach
  author?: Pick<Profile, "id" | "username" | "avatar_url">; // DB name: created_at
}

// Unified Comments configuration to support both app and idea comment tables
export interface Comment {
  id?: number;                // DB uses number
  content: string;           // DB name: content instead of body
  created_at: string | null; // DB name: created_at
  user_id: string;           // DB name: user_id
  idea_id?: number | null;   // From idea_comments table
  author?: Pick<Profile, "id" | "username" | "avatar_url">; // DB name: created_at
  parent_comment_id?: number | null;
}

// Note: Badge was completely dropped because it doesn't exist anywhere in your Supabase schema.