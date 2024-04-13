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
  searchParams?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}> = async ({ searchParams }) => {
  const tags = await getTags();

  return (
    <main className='flex flex-1 flex-col place-items-center justify-center py-10 md:py-16'>
      <h1 className='mt-6 text-2xl font-bold'>Create Review</h1>
      <p className='mb-6'>Fill in the fields below to complete your review</p>

      <CreateReviewForm tags={tags} initialPropertyDetails={searchParams} />
    </main>
  );
};

export default CreateReviewPage;
