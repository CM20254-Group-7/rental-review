import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

import { notFound } from 'next/navigation';
import LandlordRegistrationForm from './form';

const NotLoggedInMessage: React.FC<{}> = () => (
  <div className='flex flex-col flex-1 place-items-center justify-center gap-4'>
    <p className='text-lg font-semibold'>
      You must be logged in to access this page
    </p>
    <Link
      href='/login?redirect=/profiles/landlord-registration'
      className='text-primary font-semibold underline cursor-pointer'
    >
      Go to Login
    </Link>
  </div>
);

const AlreadyLandlordMessage: React.FC<{}> = () => (
  <div className='flex flex-col flex-1 place-items-center justify-center gap-4'>
    <p id='already_landlord' className='text-lg font-semibold'>
      You&apos;re already a landlord.
    </p>
    <Link
      href='./'
      className='text-primary font-semibold underline cursor-pointer'
    >
      Go to Home Page
    </Link>
  </div>
);

const LandlordRegistrationPage: NextPage<{ params: {} }> = async () => {
  // Set up the supabase client
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get user.id
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return <NotLoggedInMessage />;

  // Check a user with the provided id exists
  const { data: Data, error: Error } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  if (Error || !Data) notFound();

  const { data: landlord } = await supabase
    .from('landlord_public_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  if (landlord) return <AlreadyLandlordMessage />;

  return (
    <div className='w-[70%] p-4'>
      <LandlordRegistrationForm
        userId={user.id}
      />
    </div>
  );
};

export default LandlordRegistrationPage;
