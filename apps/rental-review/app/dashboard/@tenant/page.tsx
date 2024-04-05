import React from 'react';
import StarRatingLayout from '@/components/StarRating';
import { NextPage } from 'next';

// TODO: Modify component to be able to dynamically display review data from database
// Create a new component called ReviewCard
const ReviewCard: React.FC = () => (
  <div className='flex flex-col w-full sm:w-4/5 gap-2 bg-primary/30 px-8 py-8 rounded-md mb-4'>
    <h1 className='text-xl text-accent font-bold'>12345 Example Street</h1>
    <div className='flex flex-col sm:flex-row justify-around place-items-center'>
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
    <p className='border rounded-md h-fit min-h-[5rem] bg-gray-100/10 py-1 px-2'>
      As opposed to the description, its not actually good innit?
    </p>
    <p className='ml-auto text-gray-300'>12/12/2009</p>
  </div>
);

const TenantDashboard: NextPage = () => (
  <div>
    <h2>Tenant Dashboard</h2>
    <p>Show content that is only relevant to users who have left reviews here</p>

    <div className='flex flex-col gap-1 items-center'>
      <h3 className='font-bold text-2xl text-accent'>Your reviews</h3>
      <p className='mb-6 text-lg'>All reviews created by you</p>
      <ReviewCard />
      <ReviewCard />
    </div>

    <div className='flex flex-col gap-1 items-center'>
      <h3 className='font-bold text-2xl text-accent'>Other reviews</h3>
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
