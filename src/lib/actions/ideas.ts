"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { error } from "console";
// Wire these up to real Supabase calls once the schema/RLS policies exist.
// Each one follows the same shape: get the user's session, run a scoped
// write, let RLS enforce who's allowed to do what, revalidate the path.

type ActionResult = { ok: true } | { ok?: false; error: string };


export async function likeIdea(ideaId: string): Promise<ActionResult> {
  const supabase = await createClient();
  
  // 1. Fetch user and properly halt execution if unauthorized
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) { 
    console.error("Auth Error:", authError);
    return { ok: false, error: "Unauthorized or missing session" }; 
  }

  // 2. Capture data/error from the insert operation
  const { data, error: insertError } = await supabase
    .from("idea_likes")
    .insert({ 
      idea_id: ideaId, 
      user_id: user.id 
    })
    .select(); // Optional: .select() forces Supabase to return the created row data

  if (insertError) {
    console.error("Database Insert Error details:", insertError.message, insertError.details);
    return { ok: false, error: insertError.message };
  }

  revalidatePath(`/ideas/${ideaId}`);
  revalidatePath("/");
  return { ok: true };
  
}

export async function unlikeIdea(ideaId: string): Promise<ActionResult> {
  const supabase = await createClient();
  
  // 1. Fetch user and properly halt execution if unauthorized
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) { 
    console.error("Auth Error:", authError);
    return { ok: false, error: "Unauthorized or missing session" }; 
  }

  // 2. Capture data/error from the delete operation
  const { data, error: deleteError } = await supabase
    .from("idea_likes")
    .delete()
    .eq("idea_id", ideaId)
    .eq("user_id", user.id)
    .select(); // Optional: .select() forces Supabase to return the deleted row data

  if (deleteError) {
    console.error("Database Delete Error details:", deleteError.message, deleteError.details);
    return { ok: false, error: deleteError.message };
  }
  revalidatePath(`/ideas/${ideaId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function postComment(
  parentId: string,
  content: string
): Promise< { ok: true } | { ok: false; error: "empty_comment" | "not_authenticated" | "insert_failed" }> {
  if (!content.trim()) return { ok: false, error: "empty_comment" };

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "not_authenticated" };
  }

  const { data, error } = await supabase
          .from("idea_comments")
          .insert({ idea_id: parentId, content, user_id: user.id })
          .select("id, content, created_at, author:profiles ( id, username, avatar_url )")
          .single()

  if (error || !data) {
    console.error(error);
    return { ok: false, error: "insert_failed" };
  }

  revalidatePath(`/ideas/${parentId}`);

  return { ok: true };
}

export async function raiseMergeRequest(ideaId: number, proposal: string) {
  if (!proposal.trim()) return { error: "empty_proposal" };
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "not_authenticated" };
  }

  const { data, error } = await supabase
    .from("pending_merges")
    .insert({
      idea: ideaId,
      merge_content: proposal,
      requested_by: user.id,
      status: "pending",
      upvotes: 0,
      downvotes: 0,
    })
    .select("id, idea, merge_content, status, upvotes, downvotes, created_at, expires_at, requested_by")
    .single();

  if (error || !data) {
    console.error(error);
    return { error: "insert_failed" };
  }
  revalidatePath(`/ideas/${ideaId}`);
  return { ok: true };
}

export async function voteMergeRequest(
  mergeRequestId: string, 
  ideaId: number,
  vote: "up" | "down"
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "not_authenticated" };
  }

  // Check if the user has already voted on this merge request
  const { data: existingVote, error: fetchError } = await supabase
    .from("merge_votes")
    .select("id, vote_type")
    .eq("merge_id", mergeRequestId)
    .eq("user_id", user.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 means no rows found
    console.error(fetchError);
    return { error: "fetch_failed" };
  }

  if (existingVote && existingVote.vote_type !== vote) {
    // If the user has already voted, update their vote
    const { error: updateError } = await supabase
      .from("merge_votes")
      .update({ vote_type: vote })
      .eq("id", existingVote.id);

    if (updateError) {
      console.error(updateError);
      return { error: "update_failed" };
    }
  } 
  else if (existingVote && existingVote.vote_type === vote) {
    // If the user has already voted the same way, remove their vote (toggle off)
    const { error: deleteError } = await supabase
      .from("merge_votes")
      .delete()
      .eq("id", existingVote.id);

    if (deleteError) {
      console.error(deleteError);
      return { error: "delete_failed" };
    }
  }
  const { error: insertError } = await supabase
      .from("merge_votes")
      .insert({
        merge_id: mergeRequestId,
        user_id: user.id,
        vote_type: vote,
      });

  if (insertError) {
    console.error(insertError);
    return { error: "insert_failed" };
  }
  revalidatePath(`/ideas/${ideaId}`);
  return { ok: true };
}


