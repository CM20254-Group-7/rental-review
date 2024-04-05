'use client';

import { FC } from 'react';
import { useFormState } from 'react-dom';

import CreateReviewForm from '@/components/CreateReviewForm';
import { TextInput } from '@/components/ClientTremor';
import { createReview } from './actions';

const NewPropertyReviewForm: FC<{
  tags: string[];
  initialPropertyDetails?: {
    street?: string
    city?: string
    postalCode?: string
    country?: string
  },
}> = ({
  tags,
  initialPropertyDetails,
}) => {
  const [state, dispatch] = useFormState(createReview, {});

  return (
    <form
      className='flex flex-col gap-2 max-w-prose w-full border p-4 rounded-md'
      action={dispatch}
    >
      <div className='max-w-sm'>
        <h3 className='text-xl font-bold'>Property Details</h3>
        <label htmlFor='property_house'>
          House
          <TextInput
            aria-label='House'
            name='property_house'
            placeholder=''
            error={!(typeof state.errors?.property_house === 'undefined')}
            errorMessage={state.errors?.property_house?.join(', ')}
          />
        </label>

        <label htmlFor='property_street'>
          Street
          <TextInput
            aria-label='Street'
            name='property_street'
            placeholder=''
            defaultValue={initialPropertyDetails?.street}
            error={!(typeof state.errors?.property_street === 'undefined')}
            errorMessage={state.errors?.property_street?.join(', ')}
          />
        </label>

        <label htmlFor='property_postcode'>
          Postcode
          <TextInput
            aria-label='Postcode'
            name='property_postcode'
            placeholder=''
            defaultValue={initialPropertyDetails?.postalCode}
            error={!(typeof state.errors?.property_postcode === 'undefined')}
            errorMessage={state.errors?.property_postcode?.join(', ')}
          />
        </label>

        <label htmlFor='property_county'>
          City/County
          <TextInput
            aria-label='City/County'
            name='property_county'
            placeholder=''
            defaultValue={initialPropertyDetails?.city}
            error={!(typeof state.errors?.property_county === 'undefined')}
            errorMessage={state.errors?.property_county?.join(', ')}
          />
        </label>

        <label htmlFor='property_country'>
          Country
          <TextInput
            aria-label='Country'
            name='property_country'
            placeholder=''
            defaultValue={initialPropertyDetails?.country}
            error={!(typeof state.errors?.property_country === 'undefined')}
            errorMessage={state.errors?.property_country?.join(', ')}
          />
        </label>
      </div>

      <h3 className='text-xl font-bold mt-6'>Review Details</h3>
      <CreateReviewForm
        tags={tags}
        errors={state.errors}
      />

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

export default NewPropertyReviewForm;
