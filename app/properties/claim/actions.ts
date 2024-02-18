'use server'

import { createClient as createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export type State = {
    errors?: {
        property_id?: string[],
        landlord_id?: string[],
        started_at?: string[],
        ended_at?: string[]
    };
    message?: string | null;
};

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
    if (userError) {
        return {
            message: 'Error Fetching User'
        }
    }
    
    if (!user) {
        return {
            message: 'User Not Logged In'
        }
    }

    //  check a the user is already the landlord of the property for this time period
    const { data: propertyOwnership, error: propertyOwnershipError } = await supabase
        .from('property_ownership')
        .select('landlord_id, started_at, ended_at')
        .eq('property_id', property_id)

    if (propertyOwnershipError) {
        return {
            message: 'Error Fetching Property Ownership'
        }
    }

    // if empty then good

    if (propertyOwnership != null) {
        for (const property of propertyOwnership) {

            if (property.landlord_id == user.id) {
                // tried to claim the same property again
                return {
                    message: 'User is already the landlord of this property'
                }

            } else if (property.landlord_id != null) {
                // property is claimed by someone else
                const currentStart = formData.get('started_at') || new Date().toISOString();
                const currentEnd = formData.get('ended_at') || new Date().toISOString();

                if (property.ended_at && currentEnd < property.ended_at) {
                    // new start date is before current end date
                    return {
                        message: 'New start date is before the current end date'
                    }
                    
                } else if (property.started_at && currentStart > property.started_at) {
                    // new end date is after current start date
                    return {
                        message: 'New end date is after the current start date'
                    }
                }

            } else {
                // property is good to claim
                const { data, error } = await supabase
                    .from('property_ownership')
                    .update({
                        landlord_id: user.id,
                        started_at: formData.get('started_at')?.toString(),
                        ended_at: null
                    })
                    .match({ id: property_id })

                if (error) {
                    return {
                        message: 'Error Claiming Property'
                    }
                }
            }
        }
    }
}