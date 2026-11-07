"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteComment } from "@/actions/delete-comment";

type DeleteCommentButtonProps = {
  commentId: number;
  slug: string;
};

export default function DeleteCommentButton({
  commentId,
  slug,
}: DeleteCommentButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    setIsDeleting(true);
    const result = await deleteComment(commentId, slug);

    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
      return;
    }

    toast.success("Comment deleted");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="shrink-0 text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}