'use server'

import { Database } from "@/supabase.types";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from '@supabase/supabase-js'
import { cookies } from "next/headers";
import { z } from "zod";

const landlordSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string().min(10).max(15),
    properties: z.array(z.string())
})

export type State = {
    errors?: {
        id?: string[]
        name?: string[],
        email?: string[],
        phone?: string[],
        properties?: string[]
    };
    message?: string | null;
};

const getLandlordDetails = async (
    landlord: {
        id: string,
        name: string,
        email: string,
        phone: string,
        properties: string[] | undefined
    },
    formData: FormData
) : Promise<State> => {
    // Validate input
    const validatedFields = landlordSchema.safeParse({
        id: landlord.id,
        name: landlord.name,
        email: landlord.email,
        phone: landlord.phone,
        properties: landlord.properties
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid Fields Submitted'
        }
    }



    let {
        id,
        name,
        email,
        phone,
        properties
    } = landlord

    // create service client
    const serviceSupabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    )

    if (!id) {
        return {
            message: 'No Landlord Selected'
        }
    }

    // get landlord owned properties
    const { data: landlordProperties, error } = await serviceSupabase
        .from('property_ownership')
        .select('*')
        .eq('landlord_id', id)


    if (error) {
        return {
            message: 'Error fetching landlord details'
        }
    }

    if (!landlordProperties) {
        return {
            message: 'Landlord does not own any properties'
        }
    }

    // get user
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user) {
        return {
            message: 'User Not Logged In'
        }
    }
    

    return {
        message: "Landlord details fetched successfully",
        errors: undefined
    }
}

export { getLandlordDetails }