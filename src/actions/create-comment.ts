"use server"

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server-client";
import { commentSchema, type CommentInput } from "@/lib/schemas";

export async function createComment(
    postId:number,
    slug:string,
    input:CommentInput
){
    const parsed = commentSchema.safeParse(input);
    
    if(!parsed.success){
        return{ error: parsed.error.issues[0].message }
        }
        
        const supabase = await createClient()

        const {
            data:{user},
        } = await supabase.auth.getUser()

        if(!user){
            return{ error:"You must be logged in to comment."}
        }

            const { error } = await supabase.from("comments").insert({
                content:parsed.data.content,
                post_id:postId,
                user_id:user.id
            })

            if(error){
                return{ error: error.message }
            }

            revalidatePath(`/${slug}`)
            return{ error:null}
        }
    
