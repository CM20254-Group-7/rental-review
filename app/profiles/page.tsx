import { NextPage } from 'next';
import React, { Suspense } from 'react';

import LandlordResults from './LandlordResults'; // Import the 'LandlordResults' component as a named export

const profilePage: NextPage = () => (

  <div className='flex-1 w-screen flex flex-row justify-center items-center py-20'>
    <div className='flex flex-col w-full max-w-prose gap-8 items-center'>
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>Top 10 landlords</h2>
      <span className='border border-b w-full border-accent' />
      <Suspense fallback={<div>Loading...</div>}>
        <LandlordResults />
      </Suspense>
    </div>
  </div>

);

export default profilePage;
