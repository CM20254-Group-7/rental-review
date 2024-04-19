import { NextPage } from 'next';
import Image from 'next/image'; // Import the Image component from the appropriate package

import AddPictureForm from './form';
import { getReviewPictures } from './actions';

const AddPicturePage: NextPage<{
  params: {
    id: string;
    reviewID: string;
  };
}> = async ({ params: { id: propertyId, reviewID: reviewId } }) => {
  const pictures = (await getReviewPictures(reviewId ?? '')) as unknown as {
    photo: string;
  }[];
  const pictureArray: string[] = [];

  for (let i = 0; i < pictures.length; i += 1) {
    pictureArray.push(pictures[i]?.photo ?? '');
  }

  return (
    <main className='flex flex-1 flex-col place-items-center justify-center py-10 md:py-16'>
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
      {pictureArray.map((picture, index) => (
        <Image
          key={index}
          src={pictureArray[index] ?? ''}
          alt={`Picture ${index}`}
          width={100}
          height={100}
        />
      ))}
    </main>
  );
};

export default AddPicturePage;
