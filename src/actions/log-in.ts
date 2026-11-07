"use server";

import { createClient } from "@/lib/supabase/server-client";
import type { LogInInput } from "@/lib/schemas";


export async function logIn(userdata: LogInInput){
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email: userdata.email,
        password: userdata.password,

    });

    if(error) {
        return { error: error.message };
    }

    return { error:null}

}