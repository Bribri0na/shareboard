"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server-client";
import { postSchema, type PostInput } from "@/lib/schemas";
import { slugify } from "@/lib/slugify";

const MAX_IMAGE_SIZE = 5 * 1024 *1024

export async function createPost(
  input: PostInput & { image?: File |null }
) {
  // Validate again on the server, never trust only the browser
  const parsed = postSchema.safeParse({
    title: input.title,
    content: input.content,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a post." };
  }

  let imagePath: string | null = null;
  const image = input.image;

  if(image && image.size > 0){
    if(!image.type.startsWith("image/")){
      return{ error:"Only image files are allowed."}
    }

    if(image.size > MAX_IMAGE_SIZE) {
      return { error: "Image must be 5 MB or smaller."}
    }
    
    const extension = image.name.split(".").pop() ??"jpg";
    imagePath = `${user.id}/${Date.now()}.${extension}`;

    const{ error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(imagePath, image, { contentType: image.type });

    if(uploadError){
      return{ error: uploadError.message }
    }
  }

  const slug = `${slugify(parsed.data.title)}-${Date.now()}`;

  const { error } = await supabase.from("posts").insert({
    title: parsed.data.title,
    content: parsed.data.content,
    slug,
    user_id: user.id,
    image:imagePath,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { error: null };
}