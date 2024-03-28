import createClient from '@/utils/supabase/server';
import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense, cache } from 'react';
import { CurrentPropertyResults, PreviousPropertyResults, PropertyResultsLoading } from './PropertyResults';
import ReviewResults, { ReviewResultsLoading } from './ReviewResults';
import LandlordProfile from './LandlordProfile';

const getLandlordBio = cache(async (landlordId: string) => {
  // set up the supabase client
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // check if a landlord with the provided id exists and get their info
  const { data, error } = await supabase
    .from('landlord_public_profiles_full')
    .select('user_id, display_name, display_email, bio, average_rating, profile_picture')
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

const landlordProfilePage: NextPage<{ params: { landlordId: string } }> = async ({ params: { landlordId } }) => {
  const landlordBio = await getLandlordBio(landlordId);

  if (!landlordBio) notFound();

  return (
    <div className='flex-1 flex flex-col w-full px-16 justify-top items-center gap-2 py-16'>
      {/* Content Boundary */}
      <div className='flex flex-col w-full max-w-4xl bg-secondary/10 shadow-md shadow-secondary/40 rounded-lg overflow-clip border'>
        {/* Details Header */}
        <LandlordProfile landlordBio={landlordBio} />

        {/* Property List */}
        <div className='flex flex-col gap-6 px-8 py-6 items-center'>
          <div className='flex flex-col w-full'>
            <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>Properties</h2>
            <span className='border border-b w-full border-accent' />
          </div>
          <div className='relative max-h-[25rem] pb-2 px-4 gap-4 justify-center items-center overflow-y-auto'>
            <div className='w-full flex flex-col gap-4'>
              <h3 className='sticky top-0 whitespace-nowrap shadow-md shadow-bg-secondary-40 bg-secondary/30 backdrop-blur-sm text-accent text-lg font-semibold px-2 py-1'>Current</h3>
              <Suspense fallback={<PropertyResultsLoading />}>
                <CurrentPropertyResults landlordId={landlordId} />
              </Suspense>
              <h3 className='sticky top-0 whitespace-nowrap w-full shadow-md shadow-bg-secondary-40 bg-secondary/30 backdrop-blur-sm text-accent text-lg font-semibold px-2 py-1'>Previous</h3>
              <Suspense fallback={<PropertyResultsLoading />}>
                <PreviousPropertyResults landlordId={landlordId} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className='flex flex-col gap-6 px-8 py-6'>
          <div className='flex flex-col w-full'>
            <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>Reviews</h2>
            <span className='border border-b w-full border-accent' />
          </div>
          <div className='flex flex-col gap-4 justify-center items-center'>
            <Suspense fallback={<ReviewResultsLoading />}>
              <ReviewResults landlordId={landlordId} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default landlordProfilePage;
