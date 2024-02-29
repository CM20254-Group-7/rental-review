/* eslint-disable no-restricted-syntax */

'use server';

import { Database } from '@/supabase.types';
import createServerClient from '@/utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { z } from 'zod';

const colisionState = (
  existingStartDate: Date,
  existingEndDate: Date | null,
  newStartDate: Date,
  newEndDate: Date | null,
): 'good' | 'bad' | 'close existing' => {
  // If existing claim is open
  if (existingEndDate === null) {
    // If new claim starts after existing claim, close existing claim
    if (newStartDate > existingStartDate) {
      return 'close existing';
    }
    // If new claim starts before existing claim, fail if the new claim does not end before the existing claim starts
    if (newEndDate === null || newEndDate > existingStartDate) {
      return 'bad';
    }

    return 'good';
  }
  // otherwise, existing claim is closed
  // If new claim is open
  if (newEndDate === null) {
    // fail if new claim starts before existing claim ends
    if (newStartDate < existingEndDate) {
      return 'bad';
    }
    return 'good';
  }
  // otherwise, new claim is also closed
  // fail if new claim overlaps with existing claim
  if (newStartDate < existingEndDate && newEndDate > existingStartDate) {
    return 'bad';
  }
  return 'good';
};

export type State = {
  errors?: {
    property_id?: string[],
    landlord_id?: string[],
    started_at?: string[],
    ended_at?: string[]
  };
  message?: string | null;
};

const setPropertyOwnership = async (
  selectedPropertyId: string,
  landlordId: string,
  startedAt: Date,
  endedAt: Date | null,
): Promise<State> => {
  const supabase = createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { error } = await supabase
    .from('property_ownership')
    .insert({
      property_id: selectedPropertyId,
      landlord_id: landlordId,
      started_at: startedAt.toISOString(),
      ended_at: endedAt?.toISOString(),
    });

  if (error) {
    return {
      message: 'Error Claiming Property',
    };
  }

  return {
    message: 'Property Claimed Successfully',
  };
};

const setPropertyOwnershipWithClose = async (
  selectedPropertyId: string,
  landlordId: string,
  startedAt: Date,
  endedAt: Date | null,
  openClaimToClose: false | Date,
): Promise<State> => {
  if (!openClaimToClose) return setPropertyOwnership(selectedPropertyId, landlordId, startedAt, endedAt);

  // close the open claim with the day before the new claim starts
  const supabase = createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { error } = await supabase
    .from('property_ownership')
    .update({
      ended_at: startedAt.toISOString(),
    })
    .eq('property_id', selectedPropertyId)
    .eq('started_at', openClaimToClose.toISOString());

  if (error) {
    return {
      message: 'Error Closing Open Claim',
    };
  }

  // continue to create the new claim
  return setPropertyOwnership(selectedPropertyId, landlordId, startedAt, endedAt);
};

const ClaimPropertySchema = z
  .object({
    property_id: z.string(),
    landlord_id: z.string(),
    started_at: z.coerce.date(),
    ended_at: z.coerce.date().nullable(),
  })
  // started_at must be in the past
  .superRefine(({ started_at: startDate }, ctx) => {
    if (startDate > new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date must be in the past',
        path: ['started_at'],
      });
    }
  })
  // If ended_at is not null, it must be in the past
  .superRefine(({ ended_at: endDate }, ctx) => {
    if (endDate && endDate > new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be in the past',
        path: ['ended_at'],
      });
    }
  })
  // If ended_at is not null, it must be after started_at
  .superRefine(({ started_at: startDate, ended_at: endDate }, ctx) => {
    if (endDate && startDate >= endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be after start date',
        path: ['ended_at'],
      });
    }
  });

export const claimProperty = async (
  propertyId: string,
  landlordId: string,
  prevState: State,
  formData: FormData,
): Promise<State> => {
  const validatedFields = ClaimPropertySchema.safeParse({
    property_id: propertyId,
    landlord_id: landlordId,
    started_at: formData.get('started_at'),
    ended_at: formData.get('ended_at') !== '' ? formData.get('ended_at') : null,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid Fields. Failed to Claim Property.',
    };
  }

  const {
    property_id: selectedPropertyId,
    landlord_id: activeUserLandlordId,
    started_at: newClaimStartDate,
    ended_at: newClaimEndDate,
  } = {
    ...validatedFields.data,
    started_at: validatedFields.data.started_at,
    ended_at: validatedFields.data.ended_at,
  };

  if (!selectedPropertyId) {
    return {
      errors: {
        property_id: ['Property ID is required'],
      },
      message: 'Invalid Fields Submitted',
    };
  }
  // Need to check more things here before we can claim a property

  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // check if the user is logged in
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return {
      message: 'User Not Logged In',
    };
  }

  // Check that the user is making the claim for themself
  if (user.id !== landlordId) {
    return {
      message: 'User is making a claim for someone else',
    };
  }

  //  check if the user is already the landlord of the property for this time period
  const { data: existingPropertyOwnerships, error: existingPropertyOwnershipErrors } = await supabase
    .from('property_ownership')
    .select('landlord_id, started_at, ended_at')
    .eq('property_id', selectedPropertyId);

  if (existingPropertyOwnershipErrors) {
    return {
      message: 'Error Fetching Property Ownership',
    };
  }

  // if empty then good
  if (existingPropertyOwnerships.length === 0) {
    return setPropertyOwnership(
      selectedPropertyId,
      activeUserLandlordId,
      newClaimStartDate,
      newClaimEndDate,
    );
  }

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

  const collisionStates = existingPropertyOwnerships.map((existingPropertyOwnership) => {
    const existingClaimStartDate = new Date(existingPropertyOwnership.started_at);
    const existingClaimEndDate = existingPropertyOwnership.ended_at ? new Date(existingPropertyOwnership.ended_at) : null;
    return {
      claimStartDate: existingClaimStartDate,
      state: colisionState(
        existingClaimStartDate,
        existingClaimEndDate,
        newClaimStartDate,
        newClaimEndDate,
      ),
    };
  });

  // if any collision state is 'bad', fail
  if (collisionStates.some(({ state }) => state === 'bad')) {
    return {
      message: 'The new claim overlaps with an existing claim',
    };
  }

  // if a collison state is 'close existing' set the open claim to close
  const openClaimToClose = collisionStates.find(({ state }) => state === 'close existing')?.claimStartDate || false;

  // if no unresolveable conflicts where found, continue, closing an open claim if necessary
  return setPropertyOwnershipWithClose(selectedPropertyId, activeUserLandlordId, newClaimStartDate, newClaimEndDate, openClaimToClose);
};
