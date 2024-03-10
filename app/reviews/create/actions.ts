'use server';

import { Database } from '@/supabase.types';
import createServerClient from '@/utils/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { z } from 'zod';

const newReviewSchema = z.object({
  property_id: z.string().uuid().optional(),

  property_house: z.string().nullish(),
  property_street: z.string().nullish(),
  property_county: z.string().nullish(),
  property_postcode: z.string().nullish(),
  property_country: z.string().nullish(),

  review_date: z.coerce.date(),

  review_body: z.string().min(1).max(1000),
  property_rating: z.coerce.number().int().min(1).max(5),
  landlord_rating: z.coerce.number().int().min(1).max(5),
});

export type State = {
  errors?: {
    property_id?: string[]

    property_house?: string[],
    property_street?: string[],
    property_county?: string[],
    property_postcode?: string[],
    property_country?: string[],

    review_date?: string[],
    review_body?: string[],
    property_rating?: string[],
    landlord_rating?: string[]
  };
  message?: string | null;
};

// given either the id of an existing property or the address of a new one, creates a review written by the currently logged in user
export const createReview = async (
  property: {
    id: string | undefined,
    street: string | undefined,
    house: string | undefined,
    county: string | undefined,
    postcode: string | undefined,
    country: string | undefined,
  },
  prevState: State,
  formData: FormData,
): Promise<State> => {
  // Validate input
  const validatedFields = newReviewSchema.safeParse({
    property_id: property.id,
    property_country: formData.get('country'),
    property_county: formData.get('county'),
    property_house: formData.get('house'),
    property_postcode: formData.get('postcode'),
    property_street: formData.get('street'),
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

  let { property_id } = validatedFields.data;
  const {
    property_house,
    property_street,
    property_county,
    property_postcode,
    property_country,

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

  if (!property_id) {
    if (!property_house || !property_street || !property_postcode) {
      return {
        message: 'Property address Must be provided if property id is not. Must include house, street and postcode at minimum.',
      };
    }

    // TODO: Handle property creation

    // Check if property with address exists
    let query = serviceSupabase
      .from('properties')
      .select('id')
      .eq('house', property_house)
      .eq('street', property_street)
      .eq('postcode', property_postcode);

    if (property_county) query = query.eq('county', property_county);
    if (property_country) query = query.eq('country', property_country);

    const { data: existingProperty } = await query.maybeSingle();

    // If it does - Error
    if (existingProperty) {
      return {
        message: 'Property Already Exists',
      };
    }

    // If it doesn't - Create Property & set property_id
    const { data: newProperty, error: newPropertyError } = await serviceSupabase
      .from('properties')
      .insert({
        house: property_house,
        street: property_street,
        county: property_county,
        postcode: property_postcode,
        country: property_country,
      })
      .select('id')
      .single();

    if (newPropertyError) {
      return {
        message: 'Error Creating Property',
      };
    }

    property_id = newProperty.id; // replace with actual property_id
  }

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
