'use server';

import { createServerSupabaseClient, createServiceSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define the state to be updated by the forms
export type State = {
  errors?: {
    landlordId?: string[]
    email?: string[]
    bio?: string[],
  };
  newLandlordBio?: {
    email: string;
    bio: string;
  }
  message?: string | null;
};

// define input schema
const profileDetailsSchema = z.object({
  landlordId: z.string().uuid(),
  email: z.string().email(),
  bio: z.string(),
});

export const saveProfile = async (
  landlordId: string,
  prevState: State,
  formData: FormData,
): Promise<State> => {
  // validate and get the credentials from the form
  const validatedFields = profileDetailsSchema.safeParse({
    landlordId,
    email: formData.get('email'),
    bio: formData.get('bio'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    email,
    bio,
  } = validatedFields.data;

  // save the details
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: 'Must be logged in to edit profile.',
    };
  }

  if (user.id !== landlordId) {
    return {
      message: 'You do not have permission to edit this profile.',
    };
  }

  // create a service client
  const serviceSupabase = createServiceSupabaseClient();

  const { data, error } = await serviceSupabase
    .from('landlord_public_profiles')
    .update({
      display_email: email,
      bio,
    })
    .eq('user_id', user.id)
    .select('display_email, bio')
    .single();

  if (error) {
    return {
      message: 'Failed to save profile. Please try again.',
    };
  }

  revalidatePath(`/profile/${user.id}`);

  return {
    message: 'Saved!',
    newLandlordBio: {
      email: data.display_email,
      bio: data.bio!,
    },
  };
};

export type ProfilePictureState = ({
  error: string;
  newUrl: null;
} | {
  error: null;
  newUrl: string;
});

export const uploadProfilePicture = async (
  prevState: ProfilePictureState | undefined,
  formData: FormData,
): Promise<ProfilePictureState> => {
  // get the file from the 'newProfileFile' input
  const file = formData.get('newProfileFile') ? formData.get('newProfileFile') as File : null;

  if (!file) {
    return {
      error: 'No file provided.',
      newUrl: null,
    };
  }

  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: 'Must be logged in to edit profile.',
      newUrl: null,
    };
  }

  const landlordId = user.id;

  const serviceSupabase = createServiceSupabaseClient();

  // check if there is an existing profile picture
  const { data: data1 } = await serviceSupabase
    .from('landlord_public_profiles_full')
    .select('profile_picture')
    .eq('user_id', landlordId)
    .single();

  // if the user is not a landlord, return
  if (!data1) {
    return {
      error: 'You must be a landlord to upload a profile picture.',
      newUrl: null,
    };
  }

  // remove the existing profile picture if it exists
  if (data1.profile_picture) {
    await serviceSupabase.storage
      .from('landlord_profile_pictures')
      .remove([data1.profile_picture]);
  }

  // get the current timestamp in yyyymmddhhss format
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '');

  const { data: data2 } = await serviceSupabase.storage
    .from('landlord_profile_pictures')
    .upload(`${landlordId}/profile_picture-${timestamp}`, file, {
      upsert: true,
    });

  if (!data2) {
    return {
      error: 'Failed to upload profile picture. Please try again.',
      newUrl: null,
    };
  }

  revalidatePath(`/profile/${landlordId}`);

  return {
    error: null,
    newUrl: data2.path,
  };
};
