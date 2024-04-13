import { NextPage } from 'next';
import React, { Suspense } from 'react';

import LandlordResults from './LandlordResults'; // Import the 'LandlordResults' component as a named export

const profilePage: NextPage = () => (
  <main className='flex w-full flex-1 flex-col place-items-center justify-center py-10 md:py-16'>
    <div className='flex w-full max-w-prose flex-col items-center gap-8'>
      <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
        Top 10 landlords
      </h2>
      <span className='border-accent w-full border border-b' />
      <Suspense fallback={<div>Loading...</div>}>
        <LandlordResults />
      </Suspense>
    </div>
  </main>
);

export default profilePage;
