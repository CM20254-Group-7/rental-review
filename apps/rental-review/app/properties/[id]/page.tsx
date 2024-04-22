import Link from 'next/link';
import Image from 'next/image';

import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { notFound } from 'next/navigation';
import { NextPage } from 'next';
import { Suspense, cache } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import CurrentOwnerIndicator from '@/components/CurrentOwnerIndicator';
import AverageRating from './AverageRating';
import ReviewResults from './ReviewResults';

export const revalidate = 60 * 60; // revalidate every hour

const getPropertyDetails = cache(async (propertyId: string) => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .rpc('properties_full')
    .eq('id', propertyId)
    .select('*')
    .single();

  if (error || !data) return null;

  return {
    ...data,
  };
});

const getPictures = cache(async (propertyId: string) => {
  const supabase = createServerSupabaseClient();

  const { data: reviewData, error: reviewError } = await supabase
    .from('reviews')
    .select('review_id')
    .eq('property_id', propertyId);

  if (reviewError || !reviewData) return null;

  const reviewIds = reviewData.map((review) => review.review_id);
  const { data, error } = await supabase
    .from('review_photos')
    .select('photo')
    .in('review_id', reviewIds);

  if (error || !data) return null;

  return data;
});

const PropertyDetailPage: NextPage<{
  params: {
    id: string;
  };
}> = async ({ params }) => {
  const propertyDetails = await getPropertyDetails(params.id);
  const pictures = await getPictures(params.id);

  if (!propertyDetails) notFound();

  return (
    <main className='flex w-full flex-1 flex-col place-items-center justify-center py-10 md:py-16'>
      {/* Content Boundary */}
      <div className='bg-secondary/10 shadow-secondary/40 flex w-full max-w-4xl flex-col overflow-clip rounded-lg border shadow-md'>
        {/* Details Header */}
        <div className='bg1-secondary/30 shadow-secondary/40 flex w-full flex-row justify-between gap-2 shadow-lg'>
          {/* Property pictures */}
          {pictures != null ? (
            <div className='relative aspect-[1000/682] w-full max-w-md'>
              <div className='relative h-full w-full'>
                {pictures.map((url, index) => (
                  <div
                    key={index}
                    className={`absolute h-full w-full rounded-lg transition-opacity ${
                      index === 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      className='h-full w-full object-cover'
                      src={url.photo}
                      alt={`Image ${index + 1}`}
                      width={1000}
                      height={682}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='relative aspect-[1000/682] w-full max-w-md'>
              <Image
                className='absolute w-full max-w-md rounded-lg'
                src='/house.jpeg'
                width={1000}
                height={682}
                alt='Image of a house'
                priority
              />
              <div className='bg-background/40 flex h-full w-full flex-col place-items-center justify-center backdrop-blur'>
                <p className='text-foreground text-lg font-semibold'>
                  No Images Uploaded Yet
                </p>
              </div>
            </div>
          )}

          {/* General Property Details */}
          <div className='justify-top flex w-full flex-1 flex-col gap-2 px-8 py-4 sm:max-w-md'>
            {/* Title - Uses address */}
            <div className='flex w-full flex-col'>
              <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
                {propertyDetails.address}
              </h2>
              <span className='border-accent w-full border border-b' />
            </div>

            {/* Average Ratings */}
            <AverageRating propertyId={propertyDetails.id} />

            {/* Property Details */}
            {/* Might want to add more things like no. baths etc */}
            {propertyDetails.description && (
              <div className='flex flex-col gap-2'>
                <h3 className='text-accent text-lg font-semibold'>
                  Description:
                </h3>
                <p>{propertyDetails.description}</p>
              </div>
            )}

            {/* Ownership */}
            <h3 className='text-accent text-lg font-semibold'>
              Current Owner:
            </h3>
            <Suspense
              fallback={<ArrowPathIcon className='h-5 w-5 animate-spin' />}
            >
              <CurrentOwnerIndicator propertyId={propertyDetails.id} />
            </Suspense>
          </div>
        </div>

        {/* Review Button */}
        <div className='flex flex-col items-center justify-center gap-4'>
          <br />
          <Link
            href='/properties/[id]/review'
            as={`/properties/${propertyDetails.id}/review`}
          >
            <button
              type='submit'
              className='border-accent text-accent hover:bg-secondary/10 dark:hover:bg-accent/10 hover:shadow-accent/20 mb-5 rounded-md border px-4 py-2 hover:shadow-lg'
            >
              Review this Property
            </button>
          </Link>
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
            <ReviewResults propertyId={propertyDetails.id} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetailPage;
