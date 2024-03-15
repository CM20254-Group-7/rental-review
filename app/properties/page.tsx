import { NextPage } from 'next';
import Link from 'next/link';
import React, { Suspense, cache } from 'react';
import { cookies } from 'next/headers';
import createClient from '@/utils/supabase/server';
import PropertyResults, { PropertyResultsSkeleton } from './PropertyResults';
import AddressSearch from './AddressSearch';
import TagSearch from './TagSearch';
import SortBy from './SortBy';

const getTags = cache(async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('tags')
    .select('*');

  if (error) {
    throw error;
  }

  return data.map((tag) => tag.tag);
});

const PropertiesPage: NextPage<{
  searchParams?: {
    address?: string
    sortBy?: string
    sortOrder?: string
    street?: string
    city?: string
    postalCode?: string
    country?: string
    tags?: string | string[]
  }
}> = async ({ searchParams }) => {
  const tags = await getTags();

  return (
    <div className='flex-1 w-screen flex flex-row'>
      {/* Side Bar */}
      <div
        className='flex flex-col gap-4 text-foreground border-r px-2 py-4 w-1/4 max-w-sm'
      >
        <AddressSearch />
        <TagSearch tags={tags} />
        <SortBy />
      </div>
      <div className='flex w-full justify-center flex-1 py-20 px-4'>
        <div className='flex flex-col w-full max-w-prose gap-8 items-center'>
          <Suspense fallback={<PropertyResultsSkeleton />}>
            <PropertyResults searchParams={searchParams} />
            <div className='flex flex-col items-center gap-2'>
              <p>Can&apos;t see your property?</p>
              <Link href='/reviews/create'>
                <button
                  type='submit'
                  className='border border-accent rounded-md px-4 py-2 text-accent mb-5 hover:bg-secondary/10 dark:hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/20'
                >
                  Review a New Property
                </button>
              </Link>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
