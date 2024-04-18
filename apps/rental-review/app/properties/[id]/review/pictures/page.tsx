import { NextPage } from 'next';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@repo/supabase-client-helpers/server-only';

import AddPictureForm from './form';
import { get } from 'http';

// get all the pictures uploaded so far that are associated with the review
const getReviewPictures = async (reviewId: string, propertyId:string) => {
  const supabase = createServerSupabaseClient();
  const serviceSupabase = createServiceSupabaseClient();


  // TODO: need to fix this to get the review pictures
  const { data: reviewPictures, error } = await serviceSupabase.storage
    .from('review_pictures')
    .list(propertyId);

  if (error) {
    return null;
  }
}


const AddPicturePage: NextPage<{
  params?: {
    id: string;
  };
}> = async ({ params: { id: propertyId } = {} }) => {
  getReviewPictures('123', propertyId || '');
  return (
    <main className='flex flex-1 flex-col place-items-center justify-center py-10 md:py-16'>
      <div>

        <h1 className='flex justify-center mt-6 text-2xl font-bold'>
          Add pictures to your review
        </h1>
        <p className='mb-6'>
          Pictures can help others grasp the severity of the situation you're highlighting
        </p>
      </div>
      
      <AddPictureForm property_id={propertyId || ''}/>
    </main>
  );
};

export default AddPicturePage;
