import { NextPage } from 'next';
import Image from 'next/image';

import { deletePicture, getReviewPictures } from './actions';
import AddPictureForm from './form';

import BackButton from './_components/back-button';

const AddPicturePage: NextPage<{
  params: {
    id: string;
    reviewID: string;
  };
}> = async ({ params: { id: propertyId, reviewID: reviewId } }) => {
  const pictures = await getReviewPictures(reviewId ?? '');
  const pictureArray: string[] = [];

  for (let i = 0; i < pictures.length; i += 1) {
    pictureArray.push(pictures[i] as string);
  }

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
      {pictureArray.length > 0 && (
        <>
          <h2 className='mt-6 flex justify-center text-2xl font-bold'>
            Uploaded Pictures
          </h2>
          <br />
        </>
      )}

      {pictureArray.map((picture, index) => (
        <>
          <Image
            key={`Picture${index}`}
            src={pictureArray[index] ?? ''}
            alt={`Picture ${index}`}
            width={400}
            height={100}
            className='mb-2'
          />
          {/* <br /> */}
          <button
            type='button'
            className='rounded-md border p-2 hover:bg-gray-600/20'
            // TODO: It is saying that it should be converted to a client component
            // onClick={() => deletePicture(pictureArray[index] ?? '')}
          >
            Delete Above Picture
          </button>
          <br />
        </>
      ))}
    </main>
  );
};

export default AddPicturePage;
