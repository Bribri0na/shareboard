import Link from "next/link";
import { createClient } from "@/lib/supabase/server-client";

type PostWithAuthor = {
  id: number;
  title: string;
  slug: string;
  created_at: string;
  users: { username: string | null } | null;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const supabase = await createClient();

  let request = supabase
    .from("posts")
    .select("id, title, slug, created_at, users(username)")
    .order("created_at", { ascending: false });

  if (query) {
    // Escape % and _ so they are treated as normal characters
    const escaped = query.replace(/[%_]/g, "\\$&");
    request = request.ilike("title", `%${escaped}%`);
  }

  const { data, error } = await request;

  if (error) {
    return (
      <p className="text-red-600">Could not load posts: {error.message}</p>
    );
  }

  const posts = (data ?? []) as unknown as PostWithAuthor[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          {query ? `Search results for "${query}"` : "Latest posts"}
        </h1>

        <form action="/" className="flex gap-2">
          <input
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search by title"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800"
          >
            Search
          </button>
          {query && (
            <Link
              href="/"
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      {posts.length === 0 && (
        <p className="text-gray-600">
          {query ? `No posts match "${query}".` : "No posts yet."}
        </p>
      )}

      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <Link
              href={`/${post.slug}`}
              className="text-lg font-semibold text-gray-900 hover:underline"
            >
              {post.title}
            </Link>

            <p className="text-sm text-gray-500">
              by {post.users?.username ?? "unknown"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}