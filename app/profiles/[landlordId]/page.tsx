import Image from 'next/image';
import createClient from '@/utils/supabase/server';
import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense, cache } from 'react';
import StarRatingLayout from '@/components/StarRating';
import { CurrentPropertyResults, PreviousPropertyResults, PropertyResultsLoading } from './PropertyResults';
import ReviewResults, { ReviewResultsLoading } from './ReviewResults';

const getLandlordBio = cache(async (landlordId: string) => {
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
});

const landlordProfilePage: NextPage<{ params: { landlordId: string } }> = async ({ params: { landlordId } }) => {
  const landlordBio = await getLandlordBio(landlordId);

  if (!landlordBio) notFound();

  return (
    <div className='flex-1 flex flex-col w-full px-16 justify-top items-center gap-2 py-20'>
      {/* Content Boundary */}
      <div className='flex flex-col w-full max-w-4xl bg-secondary/10 shadow-md shadow-secondary/40 rounded-lg overflow-clip border'>
        {/* Details Header */}
        <div className='flex flex-row w-full justify-between gap-2 bg-secondary/30 shadow-lg shadow-secondary/40'>
          {/* Images - Currently not implemented so shows example image with disclaimer */}
          <div className='flex items-center justify-center p-4'>
            <div className='relative h-full aspect-square rounded-full overflow-clip'>
              <Image
                className='absolute w-full max-w-md rounded-lg'
                src='/landlord.jpeg'
                width={3000}
                height={3000}
                alt='Image of a person'
              />
              <div className='w-full h-full bg-background/40 backdrop-blur flex flex-col place-items-center justify-center'>
                <p className='p-10 text-lg font-semibold text-foreground'>Landlord Profile Pictures Coming Soon</p>
              </div>
            </div>
          </div>

          {/* General Property Details */}
          <div className='flex-1 flex flex-col w-full px-8 sm:max-w-md justify-top gap-2 py-4'>
            {/* Title - Uses Name */}
            <div className='flex flex-col w-full'>
              <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>{landlordBio.display_name}</h2>
              <span className='border border-b w-full border-accent' />
            </div>
            <StarRatingLayout rating={landlordBio.average_rating} />
            <div className='flex flex-row gap-2'>
              <h3>Contact:</h3>
              <a
                href={`mailto:${landlordBio.display_email}`}
                className='underline text-accent hover:text-accent-hover transition-colors duration-300 ease-in-out'
              >
                {landlordBio.display_email}
              </a>
            </div>
            <div className='flex flex-col gap-2'>
              <h3>About Me:</h3>
              <p className='italic'>{landlordBio.bio}</p>
            </div>
          </div>
        </div>

        {/* Property List */}
        <div className='flex flex-col gap-6 px-8 py-6'>
          <div className='flex flex-col w-full'>
            <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>Properties</h2>
            <span className='border border-b w-full border-accent' />
          </div>
          <div className='flex flex-col gap-4 justify-center items-center'>
            <div>
              <h3>Currently Owned</h3>
              <Suspense fallback={<PropertyResultsLoading />}>
                <CurrentPropertyResults landlordId={landlordId} />
              </Suspense>
            </div>
            <div>
              <h3>Previously Owned</h3>
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
