"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createComment } from "@/actions/create-comment";
import { commentSchema, type CommentInput } from "@/lib/schemas";

type CommentFormProps = {
  postId: number;
  slug: string;
};

export default function CommentForm({ postId, slug }: CommentFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = async (values: CommentInput) => {
    const result = await createComment(postId, slug, values);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Comment added!");
    reset();
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <textarea
        rows={3}
        placeholder="Write a comment..."
        {...register("content")}
        className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
      />
      {errors.content && (
        <span className="text-sm text-red-600">{errors.content.message}</span>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-end rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {isSubmitting ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}