'use client';

// TEST PAGE FOR CREATE ACTION - PLEASE REPLACE
import { useFormState } from 'react-dom';
import { NextPage } from 'next';
import { notFound, useParams } from 'next/navigation';
import { createReview } from './actions';

const CreateReviewPage: NextPage<{
  searchParams?: {
    house?: string;
    street?: string;
    county?: string;
    postcode?: string;
    country?: string;
  };
}> = ({ searchParams }) => {
  if (!searchParams) notFound();

  // define example propertyId and address, these should be determined by params in implementation
  const {
    house,
    street,
    county,
    postcode,
    country,
  } = searchParams;
  const propertyId = (useParams().id as string); // Dynamically read property id from URL

  // bind the id & address to the createReview function
  const initialState = { message: null, errors: {} };
  const createReviewWithProperty = createReview.bind(null, {
    id: propertyId,
    house,
    street,
    county,
    postcode,
    country,
  });
  const [state, dispatch] = useFormState(createReviewWithProperty, initialState);

  return (
    <div>
      <h1 className='text-2xl font-bold mt-6'>Create Review for existing property</h1>
      <p className='mb-6'>Write your review for this property</p>

      <form
        className='flex flex-col gap-2 pleace-items-center max-w-prose w-full border p-4 rounded-md mb-8'
        action={dispatch}
      >
        <label htmlFor='review_date'>
          Review Date
          <input
            className='border p-2 rounded-md ml-4'
            type='date'
            name='review_date'
            id='review_date'
            required
          />
        </label>

        <label htmlFor='review_body'>
          Review Body
          <textarea
            className='border p-2 rounded-md ml-4'
            name='review_body'
            id='review_body'
            required
          />
        </label>

        <label htmlFor='property_rating'>
          Property Rating
          <input
            className='border p-2 rounded-md ml-4'
            type='number'
            name='property_rating'
            id='property_rating'
            min='1'
            max='5'
            required
          />
        </label>

        <label htmlFor='landlord_rating'>
          Landlord Rating
          <input
            className='border p-2 rounded-md ml-4'
            type='number'
            name='landlord_rating'
            id='landlord_rating'
            min='1'
            max='5'
            required
          />
        </label>

        <button
          className='rounded-md p-2 hover:bg-gray-600/20 border'
          type='submit'
        >
          Create Review
        </button>

        {state.message && <p>{state.message}</p>}
        {state.errors && <p>{JSON.stringify(state.errors, null, '\t')}</p>}
      </form>
    </div>
  );
};

export default CreateReviewPage;
