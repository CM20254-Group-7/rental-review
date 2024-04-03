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
    email?: string[]
    bio?: string[],
  };
  message?: string | null;
};

// define input schema
const profileDetailsSchema = z.object({
  email: z.string().email(),
  bio: z.string(),
});

export const saveProfile = async (
  redirectTo: string | undefined,
  prevState: State,
  formData: FormData,
): Promise<State> => {
  // validate and get the credentials from the form
  const validatedFields = profileDetailsSchema.safeParse({
    email: formData.get('email'),
    bio: formData.get('bio'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid Fields. Failed to save profile.',
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
      message: 'Sign in failed, please check your credentials and try again.',
    };
  }

  // create a service client
  const serviceSupabase = createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { error } = await serviceSupabase
    .from('landlord_public_profiles')
    .update({
      display_email: email,
      bio,
    })
    .eq('user_id', user.id);

  if (error) {
    return {
      message: 'Sign in failed, please check your credentials and try again.',
    };
  }

  revalidatePath(`/profile/${user.id}`);

  return {
    message: 'Saved!',
  };
};
