import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server-client";
import DeletePostButton from "@/components/delete-post-button";
import DeleteCommentButton from "@/components/delete-comment-button";
import CommentForm from "@/components/comment-form";

type PostDetail = {
  id: number;
  title: string;
  content: string;
  slug: string;
  created_at: string;
  user_id: string;
  image: string | null;
  users: { username: string | null } | null;
};

type CommentItem = {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  users: { username: string | null } | null;
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, slug, created_at, user_id, image, users(username)")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  const post = data as unknown as PostDetail;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthor = user?.id === post.user_id;

  const imageUrl = post.image
  ? supabase.storage.from("post-images").getPublicUrl(post.image).data
  .publicUrl
  :null;
  

  const { data: commentData } = await supabase
    .from("comments")
    .select("id, content, created_at, user_id, users(username)")
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  const comments = (commentData ?? []) as unknown as CommentItem[];

  return (
    <div className="flex flex-col gap-8">
      <article className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-gray-900">{post.title}</h1>
          <p className="text-sm text-gray-500">
            by {post.users?.username ?? "unknown"} ·{" "}
            {new Date(post.created_at).toLocaleDateString("en-GB")}
          </p>
        </header>

        {imageUrl && (
          <img
          src={imageUrl}
          alt={post.title}
          className="w-full rounded-lg object-cover"
          />
        )}

        <p className="whitespace-pre-wrap text-gray-800">{post.content}</p>

        {isAuthor && (
          <div className="flex justify-end gap-3">
            <Link
              href={`/${post.slug}/edit`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit
            </Link>
            <DeletePostButton postId={post.id} />
          </div>
        )}
      </article>

      <section className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Comments ({comments.length})
        </h2>

        {comments.length === 0 && (
          <p className="text-gray-600">No comments yet.</p>
        )}

        <ul className="flex flex-col gap-3">
          {comments.map((comment) => {
            // Comment author or post author can delete a comment
            const canDelete = isAuthor || user?.id === comment.user_id;

            return (
              <li key={comment.id} className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500">
                      {comment.users?.username ?? "unknown"} ·{" "}
                      {new Date(comment.created_at).toLocaleDateString("en-GB")}
                    </p>
                    <p className="whitespace-pre-wrap text-gray-800">
                      {comment.content}
                    </p>
                  </div>

                  {canDelete && (
                    <DeleteCommentButton
                      commentId={comment.id}
                      slug={post.slug}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {user ? (
          <CommentForm postId={post.id} slug={post.slug} />
        ) : (
          <p className="text-gray-600">
            <Link href="/auth/login" className="font-medium underline">
              Log in
            </Link>{" "}
            to write a comment.
          </p>
        )}
      </section>
    </div>
  );
}