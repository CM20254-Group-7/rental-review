'use client';

import { FC } from 'react';
import { useFormState } from 'react-dom';

import CreateReviewForm from '@/components/CreateReviewForm';
import { createReview } from './actions';

const ReviewExistingPropertyForm: FC<{
  propertyId: string;
  tags: string[];
}> = ({ propertyId, tags }) => {
  const createReviewWithProperty = createReview.bind(null, propertyId);
  const [state, dispatch] = useFormState(createReviewWithProperty, {});

  return (
    <form
      className='pleace-items-center mb-8 flex w-full max-w-prose flex-col gap-2 rounded-md border p-4'
      action={dispatch}
    >
      <CreateReviewForm tags={tags} errors={state.errors} />

      <button
        className='rounded-md border p-2 hover:bg-gray-600/20'
        type='submit'
      >
        Create Review
      </button>

      {state.message && <p>{state.message}</p>}
      {state.errors && <p>{JSON.stringify(state.errors, null, '\t')}</p>}
    </form>
  );
};

export default ReviewExistingPropertyForm;
