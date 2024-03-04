'use client';

// TEST PAGE FOR CREATE ACTION - PLEASE REPLACE
import { useFormState } from 'react-dom';
import { NextPage } from 'next';
import { notFound } from 'next/navigation';
import { createReview } from './actions';

const CreateReviewPage: NextPage<{
  searchParams?: {
    propertyId?: string;
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
    propertyId,
    house,
    street,
    county,
    postcode,
    country,
  } = searchParams;

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
      <h1>Create Review</h1>
      <p>Test page for create review action - REPLACE ME</p>

      <form
        className='flex flex-col gap-2 pleace-items-center max-w-prose w-full border p-4 rounded-md'
        action={dispatch}
      >
        <label htmlFor='review_date'>
          Review Date
          <input
            className='border p-2 rounded-md'
            type='date'
            name='review_date'
            id='review_date'
            required
          />
        </label>

        <label htmlFor='review_body'>
          Review Body
          <textarea
            className='border p-2 rounded-md'
            name='review_body'
            id='review_body'
            required
          />
        </label>

        <label htmlFor='property_rating'>
          Property Rating
          <input
            className='border p-2 rounded-md'
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
            className='border p-2 rounded-md'
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
