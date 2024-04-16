'use client';

import { useFormState } from 'react-dom';
import React from 'react';
import { TextInput, Textarea } from '@/components/ClientTremor';
import { State, addToLandlordDB } from './actions';

// Only handles general errors
const ErrorMessage: React.FC<{ state: State }> = ({ state }) => (
  <p>{state.message}</p>
);

const LandlordRegistrationForm: React.FC = () => {
  const initialState = { errors: {}, message: null };
  const [state, dispatch] = useFormState(addToLandlordDB, initialState);

  return (
    <div className='w-full max-w-prose'>
      <h1
        className='bg-primary/50 flex min-h-[4rem] flex-col items-center justify-center rounded-t-lg border p-4 text-xl font-bold'
        id='form_header'
      >
        Hello there! Let&apos;s make you a landlord!
      </h1>

      <form
        className='bg-primary/30 flex flex-col justify-center gap-4 border-x px-4 py-8'
        action={dispatch}
      >
        <label
          className='flex max-w-xs flex-col justify-center gap-1'
          htmlFor='user_first_name'
        >
          <p className='text-lg font-bold'>First Name:</p>
          <TextInput
            name='user_first_name'
            placeholder='John'
            error={!(typeof state.errors?.user_first_name === 'undefined')}
            errorMessage={state.errors?.user_first_name?.join(', ')}
          />
        </label>

        <label
          className='flex max-w-xs flex-col justify-center gap-1'
          htmlFor='user_last_name'
        >
          <p className='text-lg font-bold'>Last Name:</p>
          <TextInput
            name='user_last_name'
            placeholder='Doe'
            error={!(typeof state.errors?.user_last_name === 'undefined')}
            errorMessage={state.errors?.user_last_name?.join(', ')}
          />
        </label>

        <label
          className='flex max-w-xs flex-col justify-center gap-1'
          htmlFor='display_name'
        >
          <p className='text-lg font-bold'>Display name:</p>
          <TextInput
            name='display_name'
            placeholder='John Doe'
            error={!(typeof state.errors?.display_name === 'undefined')}
            errorMessage={state.errors?.display_name?.join(', ')}
          />
        </label>

        <label
          className='flex max-w-xs flex-col justify-center gap-1'
          htmlFor='display_email'
        >
          <p className='text-lg font-bold'>Email:</p>
          <TextInput
            name='display_email'
            placeholder='john@doe.com'
            error={!(typeof state.errors?.display_email === 'undefined')}
            errorMessage={state.errors?.display_email?.join(', ')}
          />
        </label>

        <label
          className='flex max-w-xs flex-col justify-center gap-1'
          htmlFor='user_phoneNb'
        >
          <p className='text-lg font-bold'>Phone Number:</p>
          <TextInput
            name='user_phoneNb'
            placeholder='1234567890'
            error={!(typeof state.errors?.user_phoneNb === 'undefined')}
            errorMessage={state.errors?.user_phoneNb?.join(', ')}
          />
        </label>

        <label
          className='flex max-w-xs flex-col justify-center gap-1'
          htmlFor='address'
        >
          <p className='text-lg font-bold'>Address:</p>
          <TextInput
            name='user_house'
            placeholder='House'
            error={!(typeof state.errors?.user_house === 'undefined')}
            errorMessage={state.errors?.user_house?.join(', ')}
          />
          <TextInput
            name='user_street'
            placeholder='Street'
            error={!(typeof state.errors?.user_street === 'undefined')}
            errorMessage={state.errors?.user_street?.join(', ')}
          />
          <TextInput
            name='user_county'
            placeholder='County'
            error={!(typeof state.errors?.user_county === 'undefined')}
            errorMessage={state.errors?.user_county?.join(', ')}
          />
          <TextInput
            name='user_country'
            placeholder='Country'
            error={!(typeof state.errors?.user_country === 'undefined')}
            errorMessage={state.errors?.user_country?.join(', ')}
          />
          <TextInput
            name='user_postcode'
            placeholder='Postcode'
            error={!(typeof state.errors?.user_postcode === 'undefined')}
            errorMessage={state.errors?.user_postcode?.join(', ')}
          />
        </label>

        <label
          className='flex flex-col justify-center gap-1'
          htmlFor='user_bio'
        >
          <p className='text-lg font-bold'>Bio (optional):</p>
          <Textarea
            name='user_bio'
            placeholder='Tell us a bit about yourself'
          />
        </label>

        <button
          type='submit'
          className='border-accent text-accent hover:bg-secondary/10 dark:hover:bg-accent/10 hover:shadow-accent/20 mb-5 rounded-md border px-4 py-2 hover:shadow-lg'
        >
          Landlordify!
        </button>
      </form>

      <div className='bg-primary/50 flex min-h-[4rem] flex-col items-center justify-center gap-2 rounded-b-lg border p-4'>
        {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
        <ErrorMessage state={state} />
      </div>
    </div>
  );
};

export default LandlordRegistrationForm;
