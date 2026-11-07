"use server";

import { createClient } from "@/lib/supabase/server-client";
import type { SignUpInput } from "@/lib/schemas";


export async function signUp(userdata: SignUpInput){
    const supabase = await createClient();


    const { error } = await supabase.auth.signUp({
        email: userdata.email,
        password: userdata.password,
        options:{
            data:{ usernamel: userdata.username }
        },
    });

    if(error) {
        return { error: error.message };
    }

    return { error:null}

    

}