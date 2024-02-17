'use server'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const signIn = async (formData: FormData) => {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/')
}

export const signUp = async (formData: FormData) => {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });
    if (error) {
        console.log(error);
        if (error == null) {
            console.log(error);

        } else {
            console.log(error);
            // Password must be 6 letters
            return redirect("/login?message=There was an error while creating your account. Please try again.")

        }
    } else {
        return redirect('/login?message=Check email to continue sign in process')
    }
}