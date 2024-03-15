import { NextPage } from 'next';
// import { useFormState } from 'react-dom';
import React from 'react';
import { cookies } from 'next/headers';
import createClient from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EditProfileForm } from './forms';

const getLandlordBio = async (landlordId: string) => {
  // set up the supabase client
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // check if a landlord with the provided id exists and get their info
  const { data, error } = await supabase
    .rpc('landlord_public_profiles_with_ratings')
    .eq('user_id', landlordId)
    .select('user_id, display_name, display_email, bio, average_rating')
    .single();

  if (error || !data) return null;

  return { ...data };
};

const editProfilePage: NextPage<{ params: { landlordId: string } }> = async ({ params: { landlordId } }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!(user?.id === landlordId)) {
    notFound();
  }

  const landlordBio = await getLandlordBio(landlordId);

  if (!landlordBio) notFound();

  // const { back } = useRouter();

  return (
    <div className='flex-1 flex flex-col w-full px-16 justify-top items-center gap-2 py-16'>
      {/* Content Boundary */}

      <div className='flex-2 flex flex-col w-full max-w-4xl justify-top items-end'>
        <Link
          href={`./../${user?.id}`}
          className='ml-5 py-2 px-3 text-sm flex flex-row bg-background hover:bg-secondary/10 border hover:shadow-sm hover:shadow-primary/20 transition-all text-accent justify-center items-center gap-2 rounded-md'
        >
          Back
        </Link>
      </div>
      <div className='flex flex-col w-full max-w-4xl bg-secondary/10 shadow-md shadow-secondary/40 rounded-lg overflow-clip border'>
        {/* Details Header */}

        <div className='flex flex-row w-full justify-center gap-2 bg-secondary/30 shadow-lg shadow-secondary/40'>

          {/* General Property Details */}
          <div className='flex-1 flex flex-col w-full px-8 sm:max-w-md justify-top gap-2 py-4'>
            {/* Title - Uses Name */}
            <EditProfileForm email={landlordBio.display_email} bio={landlordBio.bio} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default editProfilePage;
