'use server';

import { createServerSupabaseClient, createServiceSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { z } from 'zod';

const newReviewSchema = z.object({
  property_house: z.string(),
  property_street: z.string(),
  property_county: z.string(),
  property_postcode: z.string(),
  property_country: z.string(),

  review_date: z.coerce.date(),

  review_body: z.string().min(1).max(1000),
  property_rating: z.coerce.number().int().min(1).max(5),
  landlord_rating: z.coerce.number().int().min(1).max(5),

  tags: z.array(z.string().min(1).max(50)),
});

export type State = {
  errors?: {
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
  prevState: State,
  formData: FormData,
): Promise<State> => {
  // Validate input
  const validatedFields = newReviewSchema.safeParse({
    property_house: formData.get('property_house') !== '' ? formData.get('property_house') : undefined,
    property_street: formData.get('property_street') !== '' ? formData.get('property_street') : undefined,
    property_county: formData.get('property_county') !== '' ? formData.get('property_county') : undefined,
    property_postcode: formData.get('property_postcode') !== '' ? formData.get('property_postcode') : undefined,
    property_country: formData.get('property_country') !== '' ? formData.get('property_country') : undefined,

    review_date: formData.get('review_date'),
    review_body: formData.get('review_body') !== '' ? formData.get('review_body') : undefined,
    property_rating: formData.get('property_rating'),
    landlord_rating: formData.get('landlord_rating'),

    tags: formData.getAll('tags'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid Fields Submitted',
    };
  }

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

    tags,
  } = validatedFields.data;

  // create service client
  const serviceSupabase = createServiceSupabaseClient();

  // get user
  const supabase = createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      message: 'User Not Logged In',
    };
  }

  // Check if property with address exists
  const { data: existingProperty } = await serviceSupabase
    .from('properties')
    .select('id')
    .match({
      house: property_house,
      street: property_street,
      county: property_county,
      postcode: property_postcode,
      country: property_country,
    })
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

  // all good, create review

  // create reviewer profile
  const { data: reviewerProfile, error: reviewerProfileError } = await serviceSupabase
    .from('reviewer_private_profiles')
    .insert({
      user_id: user.id,
      property_id: newProperty.id,
    })
    .select()
    .single();

  if (reviewerProfileError) {
    // remove the created property
    await serviceSupabase
      .from('properties')
      .delete()
      .eq('id', newProperty.id);

    return {
      message: 'Error Creating Reviewer Profile',
    };
  }

  const { reviewer_id } = reviewerProfile;

  // create reviews
  const { data } = await serviceSupabase
    .from('reviews')
    .insert({
      landlord_rating,
      review_date: review_date.toISOString(),
      property_id: newProperty.id,
      reviewer_id,
      review_body,
      property_rating,
    })
    .select('review_id')
    .single();

  if (!data) {
    // remove the created reviewer profile and property
    await serviceSupabase
      .from('reviewer_private_profiles')
      .delete()
      .eq('reviewer_id', reviewer_id);

    await serviceSupabase
      .from('properties')
      .delete()
      .eq('id', newProperty.id);

    return {
      message: 'Error Creating Review',
    };
  }

  // create tags
  const { error: tagError } = await serviceSupabase
    .from('review_tags')
    .insert(tags.map((tag) => ({
      review_id: data.review_id,
      tag,
    })));

  if (tagError) {
    // remove the created reviewer profile, property and review
    await serviceSupabase
      .from('reviews')
      .delete()
      .eq('review_id', data.review_id);

    await serviceSupabase
      .from('reviewer_private_profiles')
      .delete()
      .eq('reviewer_id', reviewer_id);

    await serviceSupabase
      .from('properties')
      .delete()
      .eq('id', newProperty.id);

    return {
      message: 'Error Creating Tags',
    };
  }

  return {
    message: 'Review Created',
  };
};
