import { NextPage } from 'next';

import Link from 'next/link';
import { getReviewPictures } from './actions';
import { AddPictureForm, DeletePictureForm } from './form';

const AddPicturePage: NextPage<{
  params: {
    id: string;
    reviewId: string;
  };
}> = async ({ params: { id: propertyId, reviewId } }) => {
  const pictures = await getReviewPictures(reviewId ?? '');
  const pictureArray: string[] = [];

  for (let i = 0; i < pictures.length; i += 1) {
    pictureArray.push(pictures[i] as string);
  }

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
      {pictureArray.length > 0 && (
        <>
          <h2 className='mt-6 flex justify-center text-2xl font-bold'>
            Uploaded Pictures
          </h2>
          <br />
        </>
      )}

      {pictureArray.map((picture, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <DeletePictureForm key={index} imageUrl={pictureArray[index] ?? ''} />
      ))}
    </main>
  );
};

export default AddPicturePage;
