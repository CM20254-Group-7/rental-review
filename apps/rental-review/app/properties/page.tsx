import { NextPage } from 'next';
import Link from 'next/link';
import React, { Suspense, cache } from 'react';
import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { Sheet, SheetContent, SheetTrigger } from '@/components/sheet';
import { Button } from '@/components/ClientTremor';
import PropertyResults, { PropertyResultsSkeleton } from './PropertyResults';
import AddressSearch from './AddressSearch';
import TagSearch from './TagSearch';
import SortBy from './SortBy';

const getTags = cache(async () => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.from('tags').select('*');

  if (error) {
    throw error;
  }

  return data.map((tag) => tag.tag);
});

const PropertiesPage: NextPage<{
  searchParams?: {
    address?: string;
    sortBy?: string;
    sortOrder?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    tags?: string | string[];
    page?: string;
  };
}> = async ({ searchParams }) => {
  const tags = await getTags();

  return (
    <main className='flex w-screen flex-1 flex-col lg:flex-row'>
      {/* Nav SideBar for lg or bigger screens */}
      <div className='text-foreground hidden flex-col gap-4 border-r px-2 py-4 lg:flex lg:w-[24rem]'>
        <AddressSearch />
        <TagSearch tags={tags} />
        <SortBy />
      </div>
      {/* Header bar to open search options on smaller screens */}
      <div className='lg:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <div className='bg-background fixed z-20  w-full border-b shadow-sm'>
              <Button
                variant='light'
                type='button'
                className='bg-foreground/5 hover:bg-foreground/10 flex h-full w-full items-center justify-center p-4'
              >
                Search & Sort
              </Button>
            </div>
          </SheetTrigger>
          <SheetContent
            side='left'
            className='text-foreground flex w-[24rem] flex-col gap-4 px-2 py-4'
          >
            {/* <div className='text-foreground hidden flex-col gap-4 border-r px-2 py-4 lg:flex lg:w-[24rem]'> */}
            <AddressSearch />
            <TagSearch tags={tags} />
            <SortBy />
            {/* </div> */}
          </SheetContent>
        </Sheet>
      </div>
      <div className='flex w-full flex-1 justify-center px-4 py-20'>
        <div className='flex max-w-prose flex-1 flex-col place-items-center gap-8 py-10 md:py-16'>
          <Suspense fallback={<PropertyResultsSkeleton />}>
            <PropertyResults searchParams={searchParams} />
            <div className='flex flex-col items-center gap-2'>
              <p>Can&apos;t see your property?</p>
              <Link
                href={`/reviews/create${
                  searchParams?.street ||
                  searchParams?.city ||
                  searchParams?.postalCode ||
                  searchParams?.country
                    ? `?${[
                        searchParams?.street
                          ? `street=${searchParams.street}`
                          : [],
                        searchParams?.city ? `city=${searchParams.city}` : [],
                        searchParams?.postalCode
                          ? `postalCode=${searchParams.postalCode}`
                          : [],
                        searchParams?.country
                          ? `country=${searchParams.country}`
                          : [],
                      ]
                        .flat()
                        .join('&')}`
                    : ''
                }`}
                className='border-accent text-accent hover:bg-secondary/10 dark:hover:bg-accent/10 hover:shadow-accent/20 mb-5 rounded-md border px-4 py-2 hover:shadow-lg'
              >
                Review a New Property
              </Link>
            </div>
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default PropertiesPage;
