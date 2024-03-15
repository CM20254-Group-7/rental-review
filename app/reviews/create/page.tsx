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
    <div className='flex flex-col flex-1 justify-center'>
      <h1 className='text-2xl font-bold mt-6'>Create Review</h1>
      <p className='mb-6'>Fill in the fields below to complete your review</p>

      <form
        className='flex flex-col gap-2 max-w-prose w-full border p-4 rounded-md'
        action={dispatch}
      >
        <h3 className='text-xl font-bold'>Property Details</h3>
        <label htmlFor='house'>
          House
          <textarea
            className='border rounded-md ml-4 bg-transparent'
            name='house'
            id='house'
            required
          />
        </label>

        <label htmlFor='street'>
          Street
          <textarea
            className='border rounded-md ml-4 bg-transparent'
            name='street'
            id='street'
            required
          />
        </label>

        <label htmlFor='postcode'>
          Postcode
          <textarea
            className='border rounded-md ml-4 bg-transparent'
            name='postcode'
            id='postcode'
            required
          />
        </label>

        <label htmlFor='county'>
          County
          <textarea
            className='border rounded-md ml-4 bg-transparent'
            name='county'
            id='county'
          />
        </label>

        <label htmlFor='country'>
          Country
          <textarea
            className='border rounded-md ml-4 bg-transparent'
            name='country'
            id='country'
          />
        </label>

        <h3 className='text-xl font-bold mt-6'>Review Details</h3>
        <label htmlFor='review_date'>
          Review Date
          <input
            className='border p-2 rounded-md ml-4 bg-transparent'
            type='date'
            name='review_date'
            id='review_date'
            required
          />
        </label>

        <label htmlFor='review_body'>
          Review Body
          <textarea
            className='border p-2 rounded-md ml-4 bg-transparent'
            name='review_body'
            id='review_body'
            required
          />
        </label>

        <label htmlFor='property_rating'>
          Property Rating
          <input
            className='border p-2 rounded-md ml-4 bg-transparent'
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
            className='border p-2 rounded-md ml-4 bg-transparent'
            type='number'
            name='landlord_rating'
            id='landlord_rating'
            min='1'
            max='5'
            required
          />
        </label>

        <button
          className='rounded-md p-2 hover:bg-gray-600/20 border mt-8'
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
