'use server'

import { Database } from "@/supabase.types";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js"
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
    if (userError)
        return {
            message: 'Error Fetching User'
        };


    if (!user)
        return {
            message: 'User Not Logged In'
        };

    //  check a the user is already the landlord of the property for this time period
    const { data: propertyOwnershipList, error: propertyOwnershipError } = await supabase
        .from('property_ownership')
        .select('landlord_id, started_at, ended_at')
        .eq('property_id', property_id)

    if (propertyOwnershipError)
        return {
            message: 'Error Fetching Property Ownership'
        };


    // if empty then good
    if (propertyOwnershipList.length == 0)
        return setPropertyOwnership(
            property_id,
            landlord_id,
            started_at,
            ended_at
        );

    // If not empty, for each existing property ownership record, there several cases to consider:
    // 1. The existing claim is closed
    //    1.1 The existing claim does not overlap with the new claim, continue
    //    1.2 The existing claim overlaps with the new claim, fail
    // 2. The existing claim is open 
    //    2.1 The new claim starts after the existing claim, close the existing claim & continue
    //    2.2 The new claim starts before the existing claim
    //        2.2.1 The new claim is closed and ends before the existing claim starts, continue
    //        2.2.2 The new claim is open or ends after the existing claim starts, fail

    // To handle 2.1, track whether there is an open claim to close as we iterate through the existing claims
    let openClaimToClose: false | { started_at: Date } = false;

    for (const propertyOwnership of propertyOwnershipList) {
        const existing_start = new Date(propertyOwnership.started_at)
        const existing_end = propertyOwnership.ended_at ? new Date(propertyOwnership.ended_at) : new Date()

        // tried to claim the same property again
        if (propertyOwnership.landlord_id == user.id)
            return {
                message: 'User is already the landlord of this property'
            };

        // closed cases
        if (existing_end != null)
            // check if the new claim overlaps with the existing claim
            if    ((ended_at <= existing_end && ended_at >= existing_start)
                || (started_at <= existing_end && started_at >= existing_start)
                || (started_at >= existing_start && ended_at <= existing_end))
                return {
                    message: 'The new claim overlaps with an existing claim'
                };
            else 
                return setPropertyOwnership(property_id, landlord_id, started_at, ended_at);



        // open cases
        else {
            const started_at = new Date(propertyOwnership.started_at); // Declare the started_at variable
            // check if the new claim is before the existing claim
            if (started_at < existing_start) {
                // whole new claim is before the existing claim, continue
                if (ended_at < existing_start)
                    continue;
                // check if the new claim is open or ends after the existing claim starts
                return {
                    message: 'The new claim overlaps with an existing claim'
                };
            }
        }
    }

    // if no unresolveable conflicts where found, continue, closing an open claim if necessary
    return setPropertyOwnershipWithClose(property_id, landlord_id, started_at, ended_at, openClaimToClose)
}


const setPropertyOwnership = async (
    propertyId: string,
    landlordId: string,
    startedAt: Date,
    endedAt: Date | null
) => {
    const supabase = createServiceClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    )

    const { error } = await supabase
        .from('property_ownership')
        .insert({
            property_id: propertyId,
            landlord_id: landlordId,
            started_at: startedAt.toISOString(),
            ended_at: endedAt?.toISOString()
        })

    if (error)
        return {
            message: 'Error Claiming Property'
        };


    return {
        message: 'Property Claimed Successfully'
    };
}

const setPropertyOwnershipWithClose = async (
    propertyId: string,
    landlordId: string,
    startedAt: Date,
    endedAt: Date | null,
    openClaimToClose: false | { started_at: Date }
): Promise<State> => {
    if (!openClaimToClose) return await setPropertyOwnership(propertyId, landlordId, startedAt, endedAt)

    // close the open claim with the day before the new claim starts
    const supabase = createServiceClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_SUPABASE_KEY!
    );
    const newEndedAt = new Date(startedAt.getDate() - 1);

    const { error } = await supabase
        .from('property_ownership')
        .update({
            ended_at: newEndedAt.toISOString()
        })
        .eq('property_id', propertyId)
        .eq('started_at', openClaimToClose.started_at.toISOString())

    if (error)
        return {
            message: 'Error Closing Open Claim'
        };

    // continue to create the new claim
    return await setPropertyOwnership(propertyId, landlordId, startedAt, endedAt)
}