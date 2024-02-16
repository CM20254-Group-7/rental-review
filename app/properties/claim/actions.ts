'use server'

import { Database } from "@/supabase.types";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from '@supabase/supabase-js'
import { cookies } from "next/headers";
import { z } from "zod";

export default async function claimProperty(formData: FormData) {
        const property_id = formData.get('property_id');

        if (!property_id) {
            return {
                errors: {
                    property_id: ['Property ID is required']
                },
                message: 'Invalid Fields Submitted'
            }
        }
        // Need to check more things here before we can claim a property
        
        const cookieStore = cookies();
        const supabase = createServerClient(cookieStore);

        // check if the user is logged in
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (!user) {
            return {
                message: 'User Not Logged In'
            }
        }

        //  check a the user is already the landlord of the property for this time period
        const { data: propertyOwnership, error: propertyOwnershipError } = await supabase
            .from('property_ownership')
            .select('started_at, ended_at')
            .eq('property_id', property_id)

        // if empty then good
        // if not empty check start and end date overlap

        if (propertyOwnership) {
            return {
                message: 'User is already the landlord of this property'
            }
        }


        // update the property_ownership table
        const user_id = user.id;

        const { data, error } = await supabase
            .from('property_ownership')
            .update({
                landlord_id: user_id,
                // TODO: currently the started_at is set to the current date
                //       maybe the landlord should be able to choose a date?
                started_at: new Date().toISOString()
            })
            .match({ id: property_id })
    }

// Things to discuss on 16/2/24 meeting:
// 1. When do the ended_at get set? 
//    - When a new landlord claims, set the ended_at of the previous landlord to the current date (-1 maybe?)
//      If this is the case then what should ended_at be set to when the property is first claimed?
//    - When claiming set a date and they choose a date?