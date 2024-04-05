'use server';

import { createServerSupabaseClient, createServiceSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { z } from 'zod';

const colisionState = (
  existingStartDate: Date,
  existingEndDate: Date | null,
  newStartDate: Date,
  newEndDate: Date | null,
  isSameLandlord: boolean,
): 'good' | 'bad' | 'close existing' => {
  // If existing claim is open
  if (existingEndDate === null) {
    // If new claim starts after existing claim, close existing claim unless it is the same landlord
    if (newStartDate > existingStartDate) {
      return isSameLandlord ? 'bad' : 'close existing';
    }
    // If the new claim starts on the same day as the existing claim, fail, as the old claim would be invalid if closed on the same day it starts
    if (newStartDate === existingStartDate) {
      return 'bad';
    }
    // If new claim starts before existing claim, fail if the new claim does not end before the existing claim starts
    if (newEndDate === null || newEndDate > existingStartDate) {
      return 'bad';
    }
    // if the claim is being made by the same landlord, require the new claim to end at least one day before the existing claim
    // convert to strings because the dates are not the same object and JS is weird about equality
    if (isSameLandlord && existingStartDate.toISOString() === newEndDate.toISOString()) {
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
  const supabase = createServiceSupabaseClient();

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
  const supabase = createServiceSupabaseClient();

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

  const supabase = createServerSupabaseClient();

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

  const collisionStates = existingPropertyOwnerships.map((existingPropertyOwnership) => {
    const isSameLandlord = existingPropertyOwnership.landlord_id === activeUserLandlordId;
    const existingClaimStartDate = new Date(existingPropertyOwnership.started_at);
    const existingClaimEndDate = existingPropertyOwnership.ended_at ? new Date(existingPropertyOwnership.ended_at) : null;
    return {
      claimStartDate: existingClaimStartDate,
      state: colisionState(
        existingClaimStartDate,
        existingClaimEndDate,
        newClaimStartDate,
        newClaimEndDate,
        isSameLandlord,
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
