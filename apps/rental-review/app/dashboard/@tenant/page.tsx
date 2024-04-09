import React from 'react';
import StarRatingLayout from '@/components/StarRating';
import { NextPage } from 'next';

// TODO: Modify component to be able to dynamically display review data from database
// Create a new component called ReviewCard
const ReviewCard: React.FC = () => (
  <div className='bg-primary/30 mb-4 flex w-full flex-col gap-2 rounded-md px-8 py-8 sm:w-4/5'>
    <h1 className='text-accent text-xl font-bold'>12345 Example Street</h1>
    <div className='flex flex-col place-items-center justify-around sm:flex-row'>
      <div className='flex flex-col'>
        <p className='text-lg font-semibold'>Property:</p>
        <StarRatingLayout rating={5} />
      </div>

      <div className='flex flex-col'>
        <p className='text-lg font-semibold'>Landlord:</p>
        <StarRatingLayout rating={5} />
      </div>
    </div>

    <p className='text-lg font-semibold'>Review:</p>
    <p className='h-fit min-h-[5rem] rounded-md border bg-gray-100/10 px-2 py-1'>
      As opposed to the description, its not actually good innit?
    </p>
    <p className='ml-auto text-gray-300'>12/12/2009</p>
  </div>
);

const TenantDashboard: NextPage = () => (
  <div>
    <h2>Tenant Dashboard</h2>
    <p>
      Show content that is only relevant to users who have left reviews here
    </p>

    <div className='flex flex-col items-center gap-1'>
      <h3 className='text-accent text-2xl font-bold'>Your reviews</h3>
      <p className='mb-6 text-lg'>All reviews created by you</p>
      <ReviewCard />
      <ReviewCard />
    </div>

    <div className='flex flex-col items-center gap-1'>
      <h3 className='text-accent text-2xl font-bold'>Other reviews</h3>
      <p className='mb-6 text-lg'>
        Reviews by other people on properties you reviewed
      </p>
      <ReviewCard />
      <ReviewCard />
      <ReviewCard />
    </div>
  </div>
);

export default TenantDashboard;
