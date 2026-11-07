import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server-client";
import EditPostForm from "@/components/edit-post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, slug, user_id")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  // Only the author may open the edit page
  if (data.user_id !== user.id) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Edit post</h1>
      <EditPostForm
        post={{
          id: data.id,
          slug: data.slug,
          title: data.title,
          content: data.content,
        }}
      />
    </div>
  );
}