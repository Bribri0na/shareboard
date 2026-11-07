"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createPost } from "@/actions/create-post";
import { postSchema, type PostInput } from "@/lib/schemas";

export default function CreatePostForm() {
  const router = useRouter();
  const [ image, setImage ] = useState<File | null>(null);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", content: "" },
  });

  const onSubmit = async (values: PostInput) => {
    const result = await createPost({ ...values, image });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Post created!");
    router.push("/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        Title
        <input
          type="text"
          {...register("title")}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.title && (
          <span className="text-sm text-red-600">{errors.title.message}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        Content
        <textarea
          rows={6}
          {...register("content")}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.content && (
          <span className="text-sm text-red-600">{errors.content.message}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        Image (optional, max 5MB)
        <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0]?? null)}
        className="text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:text-gray-700"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {isSubmitting ? "Publishing..." : "Publish"}
      </button>
    </form>
  );
}