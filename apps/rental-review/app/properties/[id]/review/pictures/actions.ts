/* eslint-disable camelcase */

'use server';

import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@repo/supabase-client-helpers/server-only';
import { z } from 'zod';

export type ReviewPictureState =
  | {
    error: string;
    message: null
  }
  | {
    error: null;
    message: string;
  }

const reviewPictureSchema = z.object({
  pictures: z.instanceof(File),
});

export const uploadPictures = async (
  propertyId: string,
  prevState: ReviewPictureState,
  formData: FormData,
): Promise<ReviewPictureState> => {

  const file = formData.get('pictures')
    ? (formData.get('pictures') as File)
    : null;

  if (!file || (file.size === 0 && file.name === 'undefined')) {
    return {
      error: 'No Pictures Uploaded',
      message: null,
    };
  }

  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: 'Must be logged in to upload pictures',
      message: null,
    };
  }

  const user_id = user.id;

  const { data:reviewerId, error: reviewerError } = await supabase
    .from('reviewer_private_profiles')
    .select('reviewer_id')
    .eq('user_id', user_id)
    .eq('property_id', propertyId)
    .single();
  
  if (reviewerError || !reviewerId) {
    return {
      error: 'Error fetching reviewer id',
      message: null,
    };
  }

  const { data:reviewId, error:reviewError } = await supabase
    .from('reviews')
    .select('review_id')
    .eq('reviewer_id', reviewerId.reviewer_id)
    .eq('property_id', propertyId)
    .single();

  if (reviewError || !reviewId) {
    return {
      error: 'Error fetching review id',
      message: null,
    };
  }

  const serviceSupabase = createServiceSupabaseClient();

  // get current timestamp in yyyymmddhhss format
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '');

  const { data: pictures } = await serviceSupabase.storage
    .from('review_pictures')
    .upload(`${propertyId}/${reviewId.review_id}@${timestamp}`, file, {
      upsert: true,
    });
  
  const { data:pictureUrl, error:pictureError } = await serviceSupabase.storage
    .from('review_pictures')
    .getPublicUrl(`${propertyId}/${reviewId.review_id}@${timestamp}`);

  if (pictureError) {
    return {
      error: 'Error fetching picture',
      message: null,
    };
  }

  // TODO: This doesn't work, need to fix
  // I don't know if I even need to write to a table
  const { error: photoError } = await supabase
    .from('review_photos')
    .insert([
      {
        review_id: reviewId.review_id,
        photo: pictureUrl,
      },
    ]);
  
  console.log(photoError);
  if (photoError) {
    return {
      error: 'Error inserting photo',
      message: null,
    };
  }
  
  // await serviceSupabase.from('review_photos').insert([
  //   {
  //     review_id: reviewId,
  //     photos: pictures,
  //   },
  // ]);

  return {
    error: null,
    message: 'Success',
  };
};

