'use server';

import { Database } from '@/supabase.types';
import createServerClient from '@/utils/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { z } from 'zod';

const newReviewSchema = z.object({
  property_id: z.string().uuid().optional(),

  property_house: z.string(),
  property_street: z.string(),
  property_county: z.string(),
  property_postcode: z.string(),
  property_country: z.string(),

  property_type: z.string(),

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

    property_type?: string[],

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
    address: string | undefined,
    beds: number | undefined,
    baths: number | undefined,
    country: string | undefined,
    county: string | undefined,
    description: string | undefined,
    house: string | undefined,
    property_type: string | undefined,
    postcode: string | undefined,
    street: string | undefined
  },
  prevState: State,
  formData: FormData,
): Promise<State> => {
  // Validate input
  const validatedFields = newReviewSchema.safeParse({
    property_id: property.id,
    property_address: property.address,
    property_baths: property.baths,
    property_beds: property.beds,
    property_country: property.country,
    property_county: property.county,
    property_description: property.description,
    property_house: property.house,
    property_type: property.property_type,
    property_postcode: property.postcode,
    property_street: property.street,
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

    property_type,

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
    if (!property_address) {
      return {
        message: 'No Property Selected',
      };
    }

    // TODO: Handle property creation

    // Check if property with address exists
    const { data: existingProperty } = await serviceSupabase
      .from('properties')
      .select('id')
      .eq('address', property_address)
      .maybeSingle();
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
        address: property_address, baths: property_baths, beds: property_beds, country: property_country, county: property_county, description: property_description, house: property_house, postcode: property_postcode, property_type, street: property_street,
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
