'use client';

import { NextPage } from 'next';
import { FC, useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Button } from '@tremor/react';
import { useRouter } from 'next/navigation';
import { AddPictureForm, DeletePictureForm } from './form';
import { getReviewPictures } from './actions';

const BackButton: FC = () => {
  const { back } = useRouter();
  return (
    <Button variant='light' onClick={back}>
      <div className='flex flex-row items-center gap-2'>
        <ArrowLeftIcon className='h-4 w-4' />
        <p>Back</p>
      </div>
    </Button>
  );
};

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
        setLoading(false);
      }
    };

    fetchData();
  }, [reviewId]);

  return (
    <main className='flex flex-1 flex-col place-items-center justify-center py-10 md:py-16'>
      <div className='flex w-full flex-row items-start'>
        <BackButton />
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
