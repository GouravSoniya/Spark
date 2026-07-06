"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { AvatarCropModal } from "@/components/profile/avatar-crop-modal";

export function AvatarUploader({
  userId,
  username,
  avatarUrl,
  size = 64,
}: {
  userId: string;
  username: string;
  avatarUrl: string | null;
  size?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert("Image must be under 8MB.");
      return;
    }
    setPendingFile(file);
  }

  async function handleCropped(blob: Blob) {
    setPendingFile(null);
    setUploading(true);

    const supabase = createClient();
    const path = `${userId}/avatar.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, blob, {
        upsert: true,
        cacheControl: "3600",
        contentType: "image/jpeg",
      });

    if (uploadError) {
      alert(`Upload failed: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const newUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: newUrl })
      .eq("id", userId);

    setUploading(false);

    if (updateError) {
      alert(`Could not save avatar: ${updateError.message}`);
      return;
    }

    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative group rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        aria-label="Change avatar"
        disabled={uploading}
      >
        <Avatar username={username} avatarUrl={avatarUrl} size={size} />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/40 transition-colors text-xs text-white opacity-0 group-hover:opacity-100">
          {uploading ? "Uploading…" : "Edit"}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </button>

      {pendingFile && (
        <AvatarCropModal
          file={pendingFile}
          onCancel={() => setPendingFile(null)}
          onCropped={handleCropped}
        />
      )}
    </>
  );
}