import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import React from 'react';

const LandlordRegistrationPrompt = () => (
  <div className='flex flex-col gap-1 items-center'>
    <h3 className='font-bold text-2xl text-accent'>Are you a landlord?</h3>
    <p className='mb-6 text-lg'>
      Click below to register
    </p>
    <Link
      href='/become-a-landlord'
      className='bg-accent text-gray-900 font-bold py-2 px-4 rounded-md mb-6'
    >
      Landlord Registration
    </Link>
  </div>
);

const StartReviewingPrompt = () => (
  <div className='flex flex-col gap-1 items-center'>
    <h3 className='font-bold text-2xl text-accent'>Are you or have you been a renter?</h3>
    <p className='mb-6 text-lg'>
      Get started reviewing by finding the places you&apos;ve lived below
    </p>
    <Link
      href='/properties'
      className='bg-accent text-gray-900 font-bold py-2 px-4 rounded-md mb-6'
    >
      Property Catalogue
    </Link>
  </div>
);

const DashboardLayout = async ({
  children: genericDashboard,
  landlord: landlordDashboard,
  tenant: tenantDashboard,
}: {
  children: React.ReactNode,
  landlord: React.ReactNode,
  tenant: React.ReactNode,
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  // route be blocked by middleware if no user, explicitly reject here for type safety
  if (!user) return null;

  // determine if the user is a landlord
  const { data: landlordProfile, error: landlordProfileError } = await supabase
    .from('landlord_public_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  const userIsLandlord = !!((!landlordProfileError && landlordProfile));

  // determine if the user has left a review
  const { data: tenantProfiles, error: tenantProfileError } = await supabase
    .from('reviewer_private_profiles')
    .select('user_id')
    .eq('user_id', user.id);

  const userHasLeftReview = !!(!tenantProfileError && tenantProfiles.length > 0);

  return (
    <div className='flex-grow flex-1 w-full flex flex-col gap-10 items-center py-10'>
      <div className='flex flex-col gap-1 items-center'>
        <h1 className='font-semibold text-6xl mb-4 mt-3 text-primary'>
          Welcome to your Dashboard
        </h1>
        <h2 className='font-bold text-xl mb-4'>
          Your go-to place for all your content
        </h2>
      </div>
      <main className='flex-1 flex flex-col gap-4'>
        {genericDashboard}
        {userIsLandlord && landlordDashboard}
        {userHasLeftReview && tenantDashboard}
        <div className='flex flex-col gap-4'>
          {!userIsLandlord && <LandlordRegistrationPrompt />}
          {!userHasLeftReview && <StartReviewingPrompt />}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
