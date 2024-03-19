'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import createClient from '@/utils/supabase/server';
import { z } from 'zod';

const LandlordRegistrationSchema = z
  .object({
    user_id: z.string().uuid(),
    display_name: z.string(),
    display_email: z.string().email(),
    user_bio: z.string().optional(),
    user_phoneNb: z.string(),
    user_postcode: z.string(),
    user_country: z.string(),
    user_county: z.string().optional(),
    user_city: z.string().optional(),
    user_street: z.string().optional(),
    user_house: z.string(),
    user_first_name: z.string(),
    user_last_name: z.string(),
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
  userId: string,
  prevState: State,
  formData: FormData,
  //   landlordName: string | null,
  //   landlordEmail: string | null,
  //   landlordBio: string | null,
  //   etc
): Promise<State> => {
  const validatedFields = LandlordRegistrationSchema.safeParse({
    user_id: userId,
    display_name: formData.get('display_name'),
    display_email: formData.get('display_email'),
    user_bio: formData.get('user_bio') !== '' ? formData.get('user_bio') : undefined,
    user_phoneNb: formData.get('user_phoneNb'),
    user_postcode: formData.get('user_postcode'),
    user_country: formData.get('user_country'),
    user_county: formData.get('user_county') !== '' ? formData.get('user_bio') : undefined,
    user_city: formData.get('user_city') !== '' ? formData.get('user_bio') : undefined,
    user_street: formData.get('user_street') !== '' ? formData.get('user_bio') : undefined,
    user_house: formData.get('user_house'),
    user_first_name: formData.get('user_first_name'),
    user_last_name: formData.get('user_last_name'),
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
    userCity,
    userStreet,
    userHouse,
    userFirstName,
    userLastName,
  } = {
    ...validatedFields.data,
    landlordId: validatedFields.data.user_id,
    displayName: validatedFields.data.display_name,
    displayEmail: validatedFields.data.display_email,
    userBio: validatedFields.data.user_bio,
    userPhoneNb: validatedFields.data.user_phoneNb,
    userPostcode: validatedFields.data.user_postcode,
    userCountry: validatedFields.data.user_country,
    userCounty: validatedFields.data.user_county,
    userCity: validatedFields.data.user_city,
    userStreet: validatedFields.data.user_street,
    userHouse: validatedFields.data.user_house,
    userFirstName: validatedFields.data.user_first_name,
    userLastName: validatedFields.data.user_last_name,
  };

  // set up the supabase client
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Adds information into landlord_public_profiles db
  await supabase
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

  await supabase
    .from('landlord_private_profiles')
    .insert(
      {
        city: userCity,
        country: userCountry,
        county: userCounty,
        first_name: userFirstName,
        house: userHouse,
        last_name: userLastName,
        phone_number: userPhoneNb,
        postcode: userPostcode,
        street: userStreet,
        user_id: landlordId,
      },
    );

  return (redirect(`/profiles/${userId}`));
};
