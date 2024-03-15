/* eslint-disable camelcase */

'use server';

import { Database } from '@/supabase.types';
import createServerClient from '@/utils/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { z } from 'zod';

const newReviewSchema = z.object({
  property_id: z.string().uuid(),

  review_date: z.coerce.date(),
  review_body: z.string().min(1).max(1000),
  property_rating: z.coerce.number().int().min(1).max(5),
  landlord_rating: z.coerce.number().int().min(1).max(5),
});

export type State = {
  errors?: {
    property_id?: string[]

    review_date?: string[],
    review_body?: string[],
    property_rating?: string[],
    landlord_rating?: string[]
  };
  message?: string | null;
};

// given either the id of an existing property or the address of a new one, creates a review written by the currently logged in user
export const createReview = async (
  propertyId: string,
  prevState: State,
  formData: FormData,
): Promise<State> => {
  // Validate input
  const validatedFields = newReviewSchema.safeParse({
    property_id: propertyId,

    review_date: formData.get('review_date'),
    review_body: formData.get('review_body'),
    property_rating: formData.get('property_rating'),
    landlord_rating: formData.get('landlord_rating'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid Fields Submitted',
    };
  }

  const {
    property_id,

    review_date,
    review_body,
    property_rating,
    landlord_rating,
  } = validatedFields.data;

  // create service client
  const serviceSupabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  // get user
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      message: 'User Not Logged In',
    };
  }

  const { id: user_id } = user;

  // check that the user has not already reviewed the property
  const { data: existingReview } = await supabase
    .from('reviewer_private_profiles')
    .select('*')
    .eq('property_id', property_id)
    .eq('user_id', user_id)
    .maybeSingle();

  if (existingReview) {
    return {
      message: 'User has already reviewed this property',
    };
  }

  // all good, create review

  // create reviewer profile
  const { data: reviewerProfile, error: reviewerProfileError } = await serviceSupabase
    .from('reviewer_private_profiles')
    .insert({
      user_id,
      property_id,
    })
    .select()
    .single();

  if (reviewerProfileError) {
    return {
      message: 'Error Creating Reviewer Profile',
    };
  }

  const { reviewer_id } = reviewerProfile;

  // create reviews
  await serviceSupabase
    .from('reviews')
    .insert({
      landlord_rating,
      review_date: review_date.toISOString(),
      property_id,
      reviewer_id,
      review_body,
      property_rating,
    });

  return {
    message: 'Review Created',
  };
};
