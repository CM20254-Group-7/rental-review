import { NextPage } from 'next';

import AddPictureForm from './form';

const AddPicturePage: NextPage<{
  params?: {
    id: string;
  };
}> = async ({ params: { id: propertyId } = {} }) => {
  return (
    <main className='flex flex-1 flex-col place-items-center justify-center py-10 md:py-16'>
      <div>
        <h1 className='mt-6 flex justify-center text-2xl font-bold'>
          Add pictures to your review
        </h1>
        <p className='mb-6'>
          Pictures can help others grasp the severity of the situation you're
          highlighting
        </p>
      </div>

      <AddPictureForm property_id={propertyId || ''} />
    </main>
  );
};

export default AddPicturePage;
