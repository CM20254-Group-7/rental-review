import { NextPage } from 'next';
import React, { Suspense } from 'react';

import LandlordResults from './LandlordResults'; // Import the 'LandlordResults' component as a named export

const profilePage: NextPage = () => (

  <div className='flex-1 w-screen flex flex-row'>
    <div className='flex w-full justify-center flex-1 py-20'>
      <div className='flex flex-col w-full max-w-prose gap-8 items-center'>
        <div className='flex flex-col items-center gap-2'>
          <div className='flex flex-col w-full'>
            <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>Landlords</h2>
            <span className='border border-b w-full border-accent' />
          </div>
          <br />
          <Suspense fallback={<div>Loading...</div>}>
            <LandlordResults />
          </Suspense>
          <p>Can&apos;t see your landlord?</p>
          <p>Ask your landlord to join us!</p>
        </div>
      </div>
    </div>
  </div>
);

export default profilePage;
