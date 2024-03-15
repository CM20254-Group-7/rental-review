'use client';

import { FC } from 'react';
import { useFormState } from 'react-dom';
import { createReview } from './actions';

const CreateReviewForm: FC<{
  propertyId: string;

}> = ({ propertyId }) => {
  const createReviewWithProperty = createReview.bind(null, propertyId);
  const [state, dispatch] = useFormState(createReviewWithProperty, {});

  return (
    <form
      className='flex flex-col gap-2 pleace-items-center max-w-prose w-full border p-4 rounded-md mb-8'
      action={dispatch}
    >
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
        className='rounded-md p-2 hover:bg-gray-600/20 border'
        type='submit'
      >
        Create Review
      </button>

      {state.message && <p>{state.message}</p>}
      {state.errors && <p>{JSON.stringify(state.errors, null, '\t')}</p>}
    </form>
  );
};

export default CreateReviewForm;
