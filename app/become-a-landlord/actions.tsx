'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import createServerClient from '@/utils/supabase/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/supabase.types';

const LandlordRegistrationSchema = z
  .object({
    user_id: z.string().uuid(),

    user_first_name: z.string(),
    user_last_name: z.string(),
    display_name: z.string(),

    display_email: z.string().email(),
    user_phoneNb: z.string(),

    user_house: z.string().optional(),
    user_street: z.string().optional(),
    user_county: z.string().optional(),
    user_postcode: z.string().length(7).optional(),
    user_country: z.string(),

    user_bio: z.string().optional(),
  });

export type State = {
  errors?: {
    user_id?: string[],
    display_name?: string[],
    display_email?: string[],
    user_bio?: string[],
    user_phoneNb?: string[],
    user_postcode?: string[],
    user_country?: string[],
    user_county?: string[],
    user_city?: string[],
    user_street?: string[],
    user_house?: string[],
    user_first_name?: string[],
    user_last_name?: string[]
  };
  message?: string | null;
};

export const addToLandlordDB = async (
  prevState: State,
  formData: FormData,
  //   landlordName: string | null,
  //   landlordEmail: string | null,
  //   landlordBio: string | null,
  //   etc
): Promise<State> => {
  // set up the supabase client
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      message: 'Must be logged in to register as a landlord.',
    };
  }

  const validatedFields = LandlordRegistrationSchema.safeParse({
    user_id: user.id,

    user_first_name: formData.get('user_first_name') !== '' ? formData.get('user_first_name') : undefined,
    user_last_name: formData.get('user_last_name') !== '' ? formData.get('user_last_name') : undefined,
    display_name: formData.get('display_name') !== '' ? formData.get('display_name') : undefined,

    display_email: formData.get('display_email') !== '' ? formData.get('display_email') : undefined,
    user_phoneNb: formData.get('user_phoneNb') !== '' ? formData.get('user_phoneNb') : undefined,

    user_house: formData.get('user_house') !== '' ? formData.get('user_house') : undefined,
    user_street: formData.get('user_street') !== '' ? formData.get('user_street') : undefined,
    user_county: formData.get('user_county') !== '' ? formData.get('user_county') : undefined,

    // strip spaces from postcode
    user_postcode: (() => {
      const postcode = formData.get('user_postcode');

      if (typeof postcode !== 'string') return undefined;
      if (postcode === '') return undefined;

      return postcode.replace(/\s/g, '');
    })(),
    user_country: formData.get('user_country') !== '' ? formData.get('user_country') : undefined,

    user_bio: formData.get('user_bio') !== '' ? formData.get('user_bio') : undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid Fields. Failed to Register Landlord.',
    };
  }

  const {
    landlordId,
    displayName,
    displayEmail,
    userBio,
    userPhoneNb,
    userPostcode,
    userCountry,
    userCounty,
    userStreet,
    userHouse,
    userFirstName,
    userLastName,
  } = {
    landlordId: validatedFields.data.user_id,
    displayName: validatedFields.data.display_name,
    displayEmail: validatedFields.data.display_email,
    userBio: validatedFields.data.user_bio,
    userPhoneNb: validatedFields.data.user_phoneNb,
    userPostcode: validatedFields.data.user_postcode,
    userCountry: validatedFields.data.user_country,
    userCounty: validatedFields.data.user_county,
    userStreet: validatedFields.data.user_street,
    userHouse: validatedFields.data.user_house,
    userFirstName: validatedFields.data.user_first_name,
    userLastName: validatedFields.data.user_last_name,
  };

  // create service client to add landlord to db
  const serviceSupabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { error: privateError } = await serviceSupabase
    .from('landlord_private_profiles')
    .insert(
      {
        user_id: landlordId,
        first_name: userFirstName,
        last_name: userLastName,
        phone_number: userPhoneNb,
        house: userHouse,
        street: userStreet,
        county: userCounty,
        postcode: userPostcode,
        country: userCountry,
      } as any,
    );

  if (privateError) {
    return {
      message: 'Failed to Register Landlord.',
    };
  }

  // Adds information into landlord_public_profiles db
  const { error: publicError } = await serviceSupabase
    .from('landlord_public_profiles')
    .insert(
      {
        user_id: landlordId,
        website: null,
        display_name: displayName,
        display_email: displayEmail,
        bio: userBio,
        profile_image_id: null,
        verified: true,
        type: '1',
      },
    );

  if (publicError) {
    //  delete the private profile if the public profile fails
    await serviceSupabase
      .from('landlord_private_profiles')
      .delete()
      .eq('user_id', landlordId);

    return {
      message: 'Failed to Register Landlord.',
    };
  }

  return (redirect(`/profiles/${user.id}`));
};
