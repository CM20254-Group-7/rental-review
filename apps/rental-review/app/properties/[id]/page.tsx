import Link from 'next/link';
import Image from 'next/image';

import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextPage } from 'next';
import { Suspense, cache } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import CurrentOwnerIndicator from '@/components/CurrentOwnerIndicator';
import AverageRating from './AverageRating';
import ReviewResults from './ReviewResults';

export const revalidate = 60 * 60; // revalidate every hour

const getPropertyDetails = cache(async (propertyId: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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

const PropertyDetailPage: NextPage<{
  params: {
    id: string
  }
}> = async ({ params }) => {
  const propertyDetails = await getPropertyDetails(params.id);

  if (!propertyDetails) notFound();

  return (
    <div className='flex-1 flex flex-col w-full px-16 justify-top items-center gap-2 py-20'>
      {/* Content Boundary */}
      <div className='flex flex-col w-full max-w-4xl bg-secondary/10 shadow-md shadow-secondary/40 rounded-lg overflow-clip border'>
        {/* Details Header */}
        <div className='flex flex-row w-full justify-between gap-2 bg-secondary/30 shadow-lg shadow-secondary/40'>
          {/* Images - Currently not implemented so shows example image with disclaimer */}
          <div className='relative w-full max-w-md aspect-[1000/682]'>
            <Image
              className='absolute w-full max-w-md rounded-lg'
              src='/house.jpeg'
              width={1000}
              height={682}
              alt='Image of a house'
            />
            <div className='w-full h-full bg-background/40 backdrop-blur flex flex-col place-items-center justify-center'>
              <p className='text-lg font-semibold text-foreground'>Property Images Coming Soon</p>
            </div>
          </div>

          {/* General Property Details */}
          <div className='flex-1 flex flex-col w-full px-8 sm:max-w-md justify-top gap-2 py-4'>
            {/* Title - Uses address */}
            <div className='flex flex-col w-full'>
              <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>{propertyDetails.address}</h2>
              <span className='border border-b w-full border-accent' />
            </div>

            {/* Average Ratings */}
            <AverageRating propertyId={propertyDetails.id} />

            {/* Property Details */}
            {/* Might want to add more things like no. baths etc */}
            {propertyDetails.description && (
              <div className='flex flex-col gap-2'>
                <h3 className='text-lg font-semibold text-accent'>Description:</h3>
                <p>{propertyDetails.description}</p>
              </div>
            )}

            {/* Ownership */}
            <h3 className='text-lg font-semibold text-accent'>Current Owner:</h3>
            <Suspense fallback={<ArrowPathIcon className='w-5 h-5 animate-spin' />}>
              <CurrentOwnerIndicator propertyId={propertyDetails.id} />
            </Suspense>
          </div>
        </div>

        {/* Review Button */}
        <div className='flex flex-col gap-4 justify-center items-center'>
          <br />
          <Link href='/properties/[id]/review' as={`/properties/${propertyDetails.id}/review`}>
            <button
              type='submit'
              className='border border-accent rounded-md px-4 py-2 text-accent mb-5 hover:bg-secondary/10 dark:hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/20'
            >
              Review this Property
            </button>
          </Link>
        </div>

        {/* Review List */}
        <div className='flex flex-col gap-6 px-8 py-6'>
          <div className='flex flex-col w-full'>
            <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>Reviews</h2>
            <span className='border border-b w-full border-accent' />
          </div>
          <div className='flex flex-col gap-4 justify-center items-center'>
            <ReviewResults propertyId={propertyDetails.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
