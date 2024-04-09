import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { NextPage } from 'next';
import React from 'react';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import ClaimPropertyForm from './form';

const NotLoggedInMessage: React.FC<{ propertyId: string }> = ({
  propertyId,
}) => (
  <div className='flex flex-1 flex-col place-items-center justify-center gap-4'>
    <p className='text-lg font-semibold'>
      You must be logged in to access this page
    </p>
    <Link
      href={`/login?redirect=/properties/${propertyId}/claim`}
      className='text-primary cursor-pointer font-semibold underline'
    >
      Go to Login
    </Link>
  </div>
);

const NotALandlordMessage: React.FC = () => (
  <div className='flex flex-1 flex-col place-items-center justify-center gap-4'>
    <p className='text-lg font-semibold'>
      You must be registered as a landlord to access this page
    </p>
    <Link
      href='/become-a-landlord'
      className='text-primary cursor-pointer font-semibold underline'
    >
      Become a Landlord
    </Link>
  </div>
);

const ClaimPropertyPage: NextPage<{ params: { id: string } }> = async ({
  params: { id: propertyId },
}) => {
  // Set up the supabase client
  const supabase = createServerSupabaseClient();

  // Check a property with the provided id exists
  const { data: propertyData, error: propertyError } = await supabase
    .rpc('properties_full')
    .eq('id', propertyId)
    .select('id, address')
    .maybeSingle();

  if (propertyError || !propertyData) notFound();

  // Check the user is logged in
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return <NotLoggedInMessage propertyId={propertyId} />;

  // Check that the user has a landlord profile
  // TESTING ONLY: landlord profile table permissions are not set up yet, use service client to fetch data
  const { data: landlordData, error: landlordError } = await supabase
    .from('landlord_private_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  if (landlordError) return <NotALandlordMessage />;

  const landlordId = landlordData.user_id;

  // State is valid, render the form
  return (
    <main className='flex w-full flex-1 flex-col place-items-center justify-center py-10 md:py-16'>
      <div className='flex w-full max-w-prose flex-col'>
        <div className='bg-primary/50 flex  flex-col justify-center gap-2 rounded-t-lg border p-4'>
          <div className='flex flex-row items-baseline gap-2'>
            <h1 className='text-lg font-bold'>Claiming Property:</h1>
            <p className='text-md'>{propertyData.address}</p>
          </div>
        </div>
        <ClaimPropertyForm property_id={propertyId} landlord_id={landlordId} />
      </div>
    </main>
  );
};

export default ClaimPropertyPage;
