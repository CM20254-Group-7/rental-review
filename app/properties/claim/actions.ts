'use server'

import { createClient as createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

export type State = {
    errors?: {
        property_id?: string[],
        landlord_id?: string[],
        started_at?: string[],
        ended_at?: string[]
    };
    message?: string | null;
};

export const ClaimPropertySchema = z
    .object({
        property_id: z.string(),
        landlord_id: z.string(),
        started_at: z.date(),
        ended_at: z.date().nullable()
    })
    // started_at must be in the past
    .superRefine(({ started_at }, ctx) => {
        if (started_at > new Date()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Start date must be in the past',
                path: ['started_at']
            })
        }
    })
    // If ended_at is not null, it must be in the past
    .superRefine(({ ended_at }, ctx) => {
        if (ended_at && ended_at > new Date()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'End date must be in the past',
                path: ['ended_at']
            })
        }
    })
    // If ended_at is not null, it must be after started_at
    .superRefine(({ started_at, ended_at }, ctx) => {
        if (ended_at && started_at > ended_at) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'End date must be after start date',
                path: ['ended_at']
            })
        }
    })

export const claimProperty = async (
    propertyId: string,
    landlordId: string,
    prevState: State,
    formData: FormData
): Promise<State> => {
    const validatedFields = ClaimPropertySchema.safeParse({
        property_id: propertyId,
        landlord_id: landlordId,
        started_at: formData.get('started_at'),
        ended_at: formData.get('ended_at')
    });

    if (!validatedFields.success) return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Invalid Fields. Failed to Claim Property.',
    }

    let {
        property_id,
        landlord_id,
        started_at,
        ended_at
    } = {
        ...validatedFields.data,
        started_at: validatedFields.data.started_at,
        ended_at: validatedFields.data.ended_at || new Date()
    }

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
    const { data: propertyOwnershipList, error: propertyOwnershipError } = await supabase
        .from('property_ownership')
        .select('landlord_id, started_at, ended_at')
        .eq('property_id', property_id)

    if (propertyOwnershipError) {
        return {
            message: 'Error Fetching Property Ownership'
        }
    }

    // if empty then good

    if (propertyOwnershipList != null) {
        for (const propertyOwnership of propertyOwnershipList) {
            const existing_start = new Date(propertyOwnership.started_at)
            const existing_end = propertyOwnership.ended_at ? new Date(propertyOwnership.ended_at) : new Date()


            if (propertyOwnership.landlord_id == user.id) {
                // tried to claim the same property again
                return {
                    message: 'User is already the landlord of this property'
                }

            } else if (propertyOwnership.landlord_id != null) {
                // property is claimed by someone else

                if (existing_end && ended_at < existing_end) {
                    // new start date is before current end date
                    return {
                        message: 'New start date is before the current end date'
                    }

                } else if (existing_start && started_at > existing_end) {
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
                        started_at: started_at.toISOString(),
                        ended_at: null
                    })
                    .match({ id: property_id })

                if (error) {
                    return {
                        message: 'Error Claiming Property'
                    }
                }

                return {
                    message: 'Property Claimed Successfully'
                }
            }
        }
    }
}