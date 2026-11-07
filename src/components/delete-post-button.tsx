"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deletePost } from "@/actions/delete-post";

export default function DeletePostButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    const result = await deletePost(postId);

    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
      return;
    }

    toast.success("Post deleted");
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}