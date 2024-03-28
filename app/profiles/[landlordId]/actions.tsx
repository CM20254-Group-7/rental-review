'use server';

import { Database } from '@/supabase.types';
import createClient from '@/utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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
  const serviceSupabase = createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

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
