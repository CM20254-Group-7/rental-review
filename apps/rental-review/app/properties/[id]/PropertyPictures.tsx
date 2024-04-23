import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import React, { cache } from 'react';
import Image from 'next/image';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

export const getPictures = cache(async (propertyId: string) => {
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

export const PictureGallery: React.FC<{ propertyId: string }> = async ({
  propertyId,
}) => {
  const pictures = await getPictures(propertyId);

  if (!pictures || pictures.length === 0) {
    return (
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
    );
  }
  return (
    <Slide>
      {pictures.map((picture, index) => (
        <div key={index} className='relative aspect-[1000/682] w-full max-w-md'>
          <Image
            className='absolute w-full max-w-md rounded-lg'
            src={picture.photo}
            width={1000}
            height={682}
            alt='Image of a house'
            priority
          />
        </div>
      ))}
    </Slide>
  );
};
