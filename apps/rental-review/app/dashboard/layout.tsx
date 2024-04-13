import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import Link from 'next/link';
import React from 'react';

const LandlordRegistrationPropmt = () => (
  <div className='flex flex-col items-center gap-1'>
    <h3 className='text-accent text-2xl font-bold'>Are you a landlord?</h3>
    <p className='mb-6 text-lg'>Click below to register</p>
    <Link
      href='/become-a-landlord'
      className='bg-accent mb-6 rounded-md px-4 py-2 font-bold text-gray-900'
    >
      Landlord Registration
    </Link>
  </div>
);

const StartReviewingPrompt = () => (
  <div className='flex flex-col items-center gap-1'>
    <h3 className='text-accent text-2xl font-bold'>
      Are you or have you been a renter?
    </h3>
    <p className='mb-6 text-lg'>
      Get started reviewing by finding the places you&apos;ve lived below
    </p>
    <Link
      href='/properties'
      className='bg-accent mb-6 rounded-md px-4 py-2 font-bold text-gray-900'
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
  children: React.ReactNode;
  landlord: React.ReactNode;
  tenant: React.ReactNode;
}) => {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // route be blocked by middleware if no user, explicitly reject here for type safety
  if (!user) return null;

  // determine if the user is a landlord
  const { data: landlordProfile, error: landlordProfileError } = await supabase
    .from('landlord_public_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  const userIsLandlord = !!(!landlordProfileError && landlordProfile);

  // determine if the user has left a review
  const { data: tenantProfiles, error: tenantProfileError } = await supabase
    .from('reviewer_private_profiles')
    .select('user_id')
    .eq('user_id', user.id);

  const userHasLeftReview = !!(
    !tenantProfileError && tenantProfiles.length > 0
  );

  return (
    <main className='flex flex-1 flex-col place-items-center justify-center py-10 md:py-16'>
      <div className='flex flex-col items-center gap-1'>
        <h1 className='text-primary mb-4 mt-3 text-6xl font-semibold'>
          Welcome to your Dashboard
        </h1>
        <h2 className='mb-4 text-xl font-bold'>
          Your go-to place for all your content
        </h2>
      </div>
      <div className='flex flex-1 flex-col items-center gap-4'>
        {genericDashboard}
        {userIsLandlord && landlordDashboard}
        {userHasLeftReview && tenantDashboard}
        <div className='flex flex-col gap-4 md:flex-row'>
          {!userIsLandlord && <LandlordRegistrationPropmt />}
          {!userHasLeftReview && <StartReviewingPrompt />}
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
