"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server-client";
import { postSchema, type PostInput } from "@/lib/schemas";

const MAX_IMAGE_SIZE = 5 *1024 * 1024;

export async function updatePost(
  postId: number, 
  input: PostInput & { image?: File |null }
) {

  const parsed = postSchema.safeParse({
    title: input.title,
    content: input.content,
});

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to edit a post." };
  }

  const updates: { title:string; content:string; image?: string } = {
    title: parsed.data.title,
    content:parsed.data.content,
  }

  const image = input.image;
  if( image && image.size > 0 ){
   
    const isImageType = image.type.startsWith("image/")
    const isImageName = /\.(jpe?g|png|gif|webp|avif)$/i.test(image.name)
    
    if (!isImageType && isImageName){
      return{ error:"Only image files are allowed."}
    }
    
    if(image.size > MAX_IMAGE_SIZE) {
      return{ error: "Image must be 5MB or smaller."}
    }

    const extension = image.name.split(".").pop()??"jpg";
    const imagePath = user.id + "/" + Date.now() + "." + extension;

    const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(imagePath, image, { contentType: image.type })

    if(uploadError){
      return{ error: uploadError.message }
    }
    updates.image = imagePath;
  }


  const { data,error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", postId)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return { error: error.message };
  }

  if(!data || data.length === 0){
    return{ error: "You are not allowed to edit this post."}
  }

  revalidatePath("/");
  return { error: null };
}