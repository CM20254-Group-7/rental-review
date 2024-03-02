import { NextPage } from 'next';
import Link from 'next/link';
import React, { Suspense } from 'react';
import PropertyResults, { PropertyResultsSkeleton } from './PropertyResults';

const SideBar: React.FC = () => (
  <form
    className='flex flex-col gap-1 text-foreground border-r px-2 py-4'
  >
    <input
      className='mt-5 rounded-md px-4 py-2 bg-inherit border mb-1'
      name='address'
      placeholder='13 Argyle Terrace, Staverton, Bath, BA2 3DF...'
    />
    <button
      className='border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-5'
      type='submit'
    >
      Search (no functionality yet)
    </button>
  </form>
);

const PropertiesPage: NextPage = () => (
  <div className='flex-1 w-screen flex flex-row'>
    <SideBar />
    <div className='flex w-full justify-center flex-1 py-20'>
      <div className='flex flex-col w-full max-w-prose gap-8 items-center'>
        <Suspense fallback={<PropertyResultsSkeleton />}>
          <PropertyResults />
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

export default PropertiesPage;
