/* eslint-disable camelcase */

'use server';

import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@repo/supabase-client-helpers/server-only';

export type ReviewPictureState =
  | {
      error: string;
      message: null;
    }
  | {
      error: null;
      message: string;
    };

export const uploadPictures = async (
  propertyId: string,
  reviewId: string,
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

  const extension = file.name.split('.').pop() as string;
  if (!['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    return {
      error: 'Invalid File Type',
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

  // check if the review_id exists
  const { data: review } = await supabase
    .from('reviews')
    .select('review_id')
    .eq('review_id', reviewId);

  if (!review || review.length === 0) {
    return {
      error: 'Review does not exist',
      message: null,
    };
  }

  const serviceSupabase = createServiceSupabaseClient();

  // get current timestamp in yyyymmddhhss format
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '');

  await serviceSupabase.storage
    .from('review_pictures')
    .upload(`${propertyId}/${reviewId}@${timestamp}`, file, {
      upsert: true,
    });

  const {
    data: { publicUrl },
  } = serviceSupabase.storage
    .from('review_pictures')
    .getPublicUrl(`${propertyId}/${reviewId}@${timestamp}`);

  const { error: photoError } = await supabase.from('review_photos').insert([
    {
      review_id: reviewId,
      photo: publicUrl,
    },
  ]);

  if (photoError) {
    return {
      error: 'Error inserting photo',
      message: null,
    };
  }

  return {
    error: null,
    message: 'Success',
  };
};

export const getReviewPictures = async (
  reviewId: string,
): Promise<string[]> => {
  const serviceSupabase = createServiceSupabaseClient();

  const { data: pictures } = await serviceSupabase
    .from('review_photos')
    .select('photo')
    .eq('review_id', reviewId);

  if (!pictures || pictures === undefined || pictures.length === 0) {
    return [];
  }

  const pictureArray: string[] = [];
  for (let i = 0; i < pictures.length; i += 1) {
    if (pictures[i]?.photo !== undefined) {
      pictureArray.push(pictures[i]?.photo ?? '');
    }
  }

  return pictureArray;
};

export const deletePicture = async (imageURL: string) => {
  const serviceSupabase = createServiceSupabaseClient();

  // Extract the file name from the imageURL
  const fileName = imageURL.substring(imageURL.lastIndexOf('/') + 1);

  // Delete the file from the storage bucket
  const { error } = await serviceSupabase.storage
    .from('review_pictures')
    .remove([fileName]);

  if (error) {
    return {
      error: 'Error deleting image',
      message: null,
    };
  }
  return {
    error: null,
    message: 'Image deleted successfully',
  };
};
