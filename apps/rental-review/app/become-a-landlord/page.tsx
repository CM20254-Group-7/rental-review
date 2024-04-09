import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

import { notFound } from 'next/navigation';
import LandlordRegistrationForm from './form';

const AlreadyLandlordMessage: React.FC = () => (
  <main className='flex flex-1 place-items-center justify-center py-10 md:py-16'>
    <p id='already_landlord' className='text-lg font-semibold'>
      You&apos;re already a landlord.
    </p>
    <Link
      href='./'
      className='text-primary cursor-pointer font-semibold underline'
    >
      Go to Home Page
    </Link>
  </main>
);

const LandlordRegistrationPage: NextPage = async () => {
  // Set up the supabase client
  const supabase = createServerSupabaseClient();

  // Middleware should redirect if user is not logged in, return null for TypeScript
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return null;

  // Check a user with the provided id exists
  const { data: Data, error: Error } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  if (Error || !Data) notFound();

  // Check if a user is a landlord
  const { data: landlord } = await supabase
    .from('landlord_public_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  // If they are, change page to a "already landlord" page
  if (landlord) return <AlreadyLandlordMessage />;

  return (
    <main className='flex w-full flex-1 place-items-center justify-center px-6 py-10 md:py-16'>
      <LandlordRegistrationForm />
    </main>
  );
};

export default LandlordRegistrationPage;
