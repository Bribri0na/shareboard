"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server-client";

export async function deleteComment(commentId: number, slug: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete a comment." };
  }


  const { data, error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .select("id");

  if (error) {
    return { error: error.message };
  }

  if (!data || data.length === 0) {
    return { error: "You are not allowed to delete this comment." };
  }

  revalidatePath(`/${slug}`);
  return { error: null };
}