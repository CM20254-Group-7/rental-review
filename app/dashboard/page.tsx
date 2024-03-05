import React from 'react';
import StarRatingLayout from '@/components/StarRating';

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

export default function dashboardPage() {
  return (
    <div className='flex-grow flex-1 w-full flex flex-col gap-20 items-center py-10'>
      <div className='flex flex-col gap-1 items-center'>
        <h1 className='font-semibold text-6xl mb-4 mt-3 text-primary'>
          Welcome to your Dashboard
        </h1>
        <h2 className='font-bold text-xl mb-4'>
          Your go-to place for all your content
        </h2>
      </div>

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

      <div className='flex flex-col gap-1 items-center'>
        <h3 className='font-bold text-2xl text-accent'>Are you a landlord?</h3>
        <p className='mb-6 text-lg'>
          Click button below to access landlord dashboard (not implemented yet)
        </p>
        <button
          type='button'
          className='bg-accent text-gray-900 font-bold py-2 px-4 rounded-md mb-6'
        >
          Landlord Dashboard
        </button>
      </div>
    </div>
  );
}
