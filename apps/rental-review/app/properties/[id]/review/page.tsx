import { NextPage } from 'next';
import { cache } from 'react';
import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import CreateReviewForm from './form';

const getTags = cache(async () => {
  const supabase = createServerSupabaseClient();

  const { data } = await supabase.from('tags').select('tag');

  return (data || []).map(({ tag }) => tag);
});

const CreateReviewPage: NextPage<{
  params: {
    id: string;
  };
}> = async ({ params: { id: propertyId } }) => {
  const tags = await getTags();

  return (
    <div>
      <h1 className='text-2xl font-bold mt-6'>
        Create Review for existing property
      </h1>
      <p className='mb-6'>Write your review for this property</p>

      <CreateReviewForm propertyId={propertyId} tags={tags} />
    </div>
  );
};

export default CreateReviewPage;
