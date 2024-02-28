'use server'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const signOut = async () => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    await supabase.auth.signOut()
    redirect('/login')
}