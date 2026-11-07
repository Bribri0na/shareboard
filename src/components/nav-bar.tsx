import Link from "next/link";
import { createClient } from "@/lib/supabase/server-client";
import { logOut } from "@/actions/log-out";

export default async function NavBar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <Link href="/" className="text-lg font-bold text-gray-900">
        ShareBoard
      </Link>

      <nav className="flex items-center gap-4 text-sm font-medium text-gray-700">
        {user ? (
          <>
            <Link href="/posts/new" className="hover:text-black">
              Create post
            </Link>
            <form action={logOut}>
              <button type="submit" className="hover:text-black">
                Log out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="hover:text-black">
              Log in
            </Link>
            <Link href="/auth/signup" className="hover:text-black">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}