"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server-client";

export async function deletePost(postId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete a post." };
  }

  // Only the author can delete: the user_id filter and RLS both check this
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return { error: error.message };
  }


  if (!data || data.length === 0) {
    return { error: "You are not allowed to delete this post." };
  }

  revalidatePath("/");
  return { error: null };
}