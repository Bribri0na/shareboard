import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server-client";
import CreatePostForm from "@/components/create-post-form";

export default async function NewPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Create post</h1>
      <CreatePostForm />
    </div>
  );
}