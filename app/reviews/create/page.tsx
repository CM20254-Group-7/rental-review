import { NextPage } from 'next';
import { cache } from 'react';
import { cookies } from 'next/headers';
import createClient from '@/utils/supabase/server';
import CreateReviewForm from './form';

const getTags = cache(async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase.from('tags').select('tag');

  return (data || []).map(({ tag }) => tag);
});

const CreateReviewPage: NextPage = async () => {
  const tags = await getTags();

  return (
    <div className='flex flex-col flex-1 justify-center'>
      <h1 className='text-2xl font-bold mt-6'>Create Review</h1>
      <p className='mb-6'>Fill in the fields below to complete your review</p>

      <CreateReviewForm
        tags={tags}
      />
    </div>
  );
};

export default CreateReviewPage;
