import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { NextPage } from 'next';
import { notFound } from 'next/navigation';
import { Suspense, cache } from 'react';
import {
  CurrentPropertyResults,
  PreviousPropertyResults,
  PropertyResultsLoading,
} from './PropertyResults';
import ReviewResults, { ReviewResultsLoading } from './ReviewResults';
import LandlordProfile from './LandlordProfile';

const getLandlordBio = cache(async (landlordId: string) => {
  // set up the supabase client
  const supabase = createServerSupabaseClient();

  // check if a landlord with the provided id exists and get their info
  const { data, error } = await supabase
    .from('landlord_public_profiles_full')
    .select(
      'user_id, display_name, display_email, bio, average_rating, profile_picture',
    )
    .eq('user_id', landlordId)
    .single();

  if (error || !data) return null;

  return {
    user_id: data.user_id!,
    display_name: data.display_name!,
    display_email: data.display_email!,
    bio: data.bio!,
    average_rating: data.average_rating!,
    profile_picture: data.profile_picture,
  };
});

const landlordProfilePage: NextPage<{
  params: { landlordId: string };
}> = async ({ params: { landlordId } }) => {
  const landlordBio = await getLandlordBio(landlordId);

  if (!landlordBio) notFound();

  return (
    <main className='flex w-full flex-1 flex-col place-items-center justify-center py-10 md:py-16'>
      {/* Content Boundary */}
      <div className='bg-secondary/10 shadow-secondary/40 flex w-full max-w-4xl flex-col overflow-clip rounded-lg border shadow-md'>
        {/* Details Header */}
        <LandlordProfile landlordBio={landlordBio} />

        {/* Property List */}
        <div className='flex flex-col items-center gap-6 px-8 py-6'>
          <div className='flex w-full flex-col'>
            <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
              Properties
            </h2>
            <span className='border-accent w-full border border-b' />
          </div>
          <div className='relative max-h-[25rem] items-center justify-center gap-4 overflow-y-auto px-4 pb-2'>
            <div className='flex w-full flex-col gap-4'>
              <h3 className='shadow-bg-secondary-40 bg-secondary/30 text-accent sticky top-0 whitespace-nowrap px-2 py-1 text-lg font-semibold shadow-md backdrop-blur-sm'>
                Current
              </h3>
              <Suspense fallback={<PropertyResultsLoading />}>
                <CurrentPropertyResults landlordId={landlordId} />
              </Suspense>
              <h3 className='shadow-bg-secondary-40 bg-secondary/30 text-accent sticky top-0 w-full whitespace-nowrap px-2 py-1 text-lg font-semibold shadow-md backdrop-blur-sm'>
                Previous
              </h3>
              <Suspense fallback={<PropertyResultsLoading />}>
                <PreviousPropertyResults landlordId={landlordId} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className='flex flex-col gap-6 px-8 py-6'>
          <div className='flex w-full flex-col'>
            <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
              Reviews
            </h2>
            <span className='border-accent w-full border border-b' />
          </div>
          <div className='flex flex-col items-center justify-center gap-4'>
            <Suspense fallback={<ReviewResultsLoading />}>
              <ReviewResults landlordId={landlordId} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
};

export default landlordProfilePage;
