"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { postSchema, type PostInput } from "@/lib/schemas";
import { updatePost } from "@/actions/update-post";

type EditPostFormProps = {
  post: {
    id: number;
    slug: string;
    title: string;
    content: string;
  };
};

export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
    },
  });

  async function onSubmit(values: PostInput) {
    const result = await updatePost(post.id, { ...values, image });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Post updated!");
    router.push(`/${post.slug}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none"
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="content" className="text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          rows={6}
          {...register("content")}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none"
        />
        {errors.content && (
          <p className="text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="image" className="text-sm font-medium text-gray-700">
          Replace image (optional, max 5 MB)
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          className="text-sm text-gray-700"
        />
        <p className="text-xs text-gray-500">
          Leave empty to keep the current image.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}