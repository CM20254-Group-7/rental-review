'use client'

import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getReviewPictures } from './actions';
import { AddPictureForm, DeletePictureForm } from './form';

const AddPicturePage: NextPage<{
  params: {
    id: string;
    reviewId: string;
  };
}> = ({ params: { id: propertyId, reviewId } }) => {
  const [pictures, setPictures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const picturesData = await getReviewPictures(reviewId ?? '');
        setPictures(picturesData);
        setLoading(false);
      } catch (error) {
        // console.error('Error fetching pictures:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [reviewId]);

  return (
    <main className='flex flex-1 flex-col place-items-center justify-center py-10 md:py-16'>
      <div className='flex w-full flex-row items-start'>
        <Link href={`/properties/${propertyId}/`}>
          <button
            type='button'
            className='text-blue-500/70 underline hover:text-blue-500'
          >
            Back
          </button>
        </Link>
      </div>
      <div>
        <h1 className='mt-6 flex justify-center text-2xl font-bold'>
          Add pictures to your review
        </h1>
        <p className='mb-6'>
          Pictures can help others grasp the severity of the situation you are
          highlighting
        </p>
      </div>
      <AddPictureForm
        property_id={propertyId || ''}
        review_id={reviewId || ''}
      />

      {/* Uploaded pictures */}
      {!loading && pictures.length > 0 && (
        <>
          <h2 className='mt-6 flex justify-center text-2xl font-bold'>
            Uploaded Pictures
          </h2>
          <br />
        </>
      )}

      {!loading &&
        pictures.map((picture, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <DeletePictureForm key={index} imageUrl={picture || ''} />
        ))}
    </main>
  );
};

export default AddPicturePage;
