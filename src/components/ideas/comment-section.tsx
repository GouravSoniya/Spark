"use client";

import { useState, useTransition, useOptimistic, useEffect } from "react";
import type { Comment } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { postComment } from "@/lib/actions/ideas";
import { timeAgo } from "@/lib/utils";
import { useRouter } from 'next/navigation';

export function CommentSection({
  parentId,
  initialComments,
}: {
  parentId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const router = useRouter();
  const [body, setBody] = useState("");
  const [isPending, startTransition] = useTransition();

  // 1. Sync state when server pushes new initialComments via router.refresh()
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // 2. Define the optimistic state configuration
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment: Comment) => [newComment, ...state] // Adds new comment to the top/bottom depending on your sorting preference
  );

  async function submit() {
    if (!body.trim()) return;

    const text = body;
    setBody(""); // Clear input instantly for snappy UX
    
    startTransition(async () => {
      // 3. Create a temporary mockup object that matches your Comment interface
      const mockNewComment: Comment = {
        id: Date.now(), // temporary unique number ID
        content: text,
        created_at: new Date().toISOString(),
        user_id: "", // temporary or pass placeholder
        author: {
          id: "",
          username: "You", // Displays "You" instantly while saving
          avatar_url: null,
        }
      };

      // 4. Update UI instantly with the temporary comment
      addOptimisticComment(mockNewComment);

      try {
        await postComment(parentId, text); // Wait for real DB insert
        router.refresh();                  // Tell Next.js to fetch fresh server data
      } catch (err) {
        console.error("Failed to post comment", err);
        // useOptimistic automatically handles the rollback if the action fails!
      }
    });
  }

  return (
    <div>
      <div className="space-y-5">
        {/* 5. Render 'optimisticComments' instead of 'comments' */}
        {optimisticComments.length === 0 && (
          <p className="text-sm text-muted">No comments yet — be the first.</p>
        )}
        {optimisticComments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <Avatar username={c.author?.username} avatarUrl={c.author?.avatar_url} size={28} />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-muted mb-1">
                <span className="text-paper font-medium">{c.author?.username}</span>
                <span>{timeAgo(c.created_at || "")}</span>
              </div>
              <p className="text-sm text-paper leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <Avatar username="you" size={28} />
        <div className="flex-1">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-16"
          />
          <Button
            size="sm"
            className="mt-2"
            disabled={!body.trim() || isPending}
            onClick={submit}
          >
            {isPending ? "Posting…" : "Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}