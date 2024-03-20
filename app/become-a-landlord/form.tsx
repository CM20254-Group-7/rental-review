'use client';

import { useFormState } from 'react-dom';
import React from 'react';
import { TextInput, Textarea } from '@tremor/react';
import { State, addToLandlordDB } from './actions';

// Only handles general errors
const ErrorMessage: React.FC<{ state: State }> = ({ state }) => <p>{state.message}</p>;

const LandlordRegistrationForm: React.FC = () => {
  const initialState = { errors: {}, message: null };
  const [state, dispatch] = useFormState(addToLandlordDB, initialState);

  return (
    <div>
      <div
        className='flex flex-col bg-primary/50 border rounded-t-lg p-4 items-center justify-center min-h-[4rem] font-bold text-xl'
        id='form_header'
      >
        Hello there! Let&apos;s make you a landlord!
      </div>

      <form
        className='flex flex-col gap-4 justify-center bg-primary/30 border-x px-4 py-8'
        action={dispatch}
      >
        <label className='flex flex-col gap-1 justify-center max-w-xs' htmlFor='user_first_name'>
          <p className='text-lg font-bold'>First Name:</p>
          <TextInput
            name='user_first_name'
            placeholder='John'
            error={!(typeof state.errors?.user_first_name === 'undefined')}
            errorMessage={state.errors?.user_first_name?.join(', ')}
          />
        </label>

        <label className='flex flex-col gap-1 justify-center max-w-xs' htmlFor='user_last_name'>
          <p className='text-lg font-bold'>Last Name:</p>
          <TextInput
            name='user_last_name'
            placeholder='Doe'
            error={!(typeof state.errors?.user_last_name === 'undefined')}
            errorMessage={state.errors?.user_last_name?.join(', ')}
          />
        </label>

        <label className='flex flex-col gap-1 justify-center max-w-xs' htmlFor='display_name'>
          <p className='text-lg font-bold'>Display name:</p>
          <TextInput
            name='display_name'
            placeholder='John Doe'
            error={!(typeof state.errors?.display_name === 'undefined')}
            errorMessage={state.errors?.display_name?.join(', ')}
          />
        </label>

        <label className='flex flex-col gap-1 justify-center max-w-xs' htmlFor='display_email'>
          <p className='text-lg font-bold'>Email:</p>
          <TextInput
            name='display_email'
            placeholder='john@doe.com'
            error={!(typeof state.errors?.display_email === 'undefined')}
            errorMessage={state.errors?.display_email?.join(', ')}
          />
        </label>

        <label className='flex flex-col gap-1 justify-center max-w-xs' htmlFor='user_phoneNb'>
          <p className='text-lg font-bold'>Phone Number:</p>
          <TextInput
            name='user_phoneNb'
            placeholder='1234567890'
            error={!(typeof state.errors?.user_phoneNb === 'undefined')}
            errorMessage={state.errors?.user_phoneNb?.join(', ')}
          />
        </label>

        <div className='flex flex-col gap-2'>
          <h2 className='text-lg font-bold'>Address:</h2>

          <label className='flex flex-col gap-1 justify-center max-w-xs' htmlFor='user_house'>
            <p className='text-lg font-bold sr-only'>House</p>
            <TextInput
              name='user_house'
              placeholder='House:'
              error={!(typeof state.errors?.user_house === 'undefined')}
              errorMessage={state.errors?.user_house?.join(', ')}
            />
          </label>

          <label className='flex flex-col gap-1 justify-center max-w-xs' htmlFor='user_street'>
            <p className='text-lg font-bold sr-only'>Street</p>
            <TextInput
              name='user_street'
              placeholder='Street'
              error={!(typeof state.errors?.user_street === 'undefined')}
              errorMessage={state.errors?.user_street?.join(', ')}
            />
          </label>

          <label className='flex flex-col gap-1 justify-center max-w-xs' htmlFor='user_county'>
            <p className='text-lg font-bold sr-only'>County</p>
            <TextInput
              name='user_county'
              placeholder='City/County'
              error={!(typeof state.errors?.user_county === 'undefined')}
              errorMessage={state.errors?.user_county?.join(', ')}
            />
          </label>

          <label className='flex flex-col gap-1 justify-center max-w-xs' htmlFor='user_postcode'>
            <p className='text-lg font-bold sr-only'>Postcode</p>
            <TextInput
              name='user_postcode'
              placeholder='Postcode'
              error={!(typeof state.errors?.user_postcode === 'undefined')}
              errorMessage={state.errors?.user_postcode?.join(', ')}
            />
          </label>

          <label className='flex flex-col gap-1 justify-center max-w-xs' htmlFor='user_country'>
            <p className='text-lg font-bold sr-only'>Country</p>
            <TextInput
              name='user_country'
              placeholder='Country'
              error={!(typeof state.errors?.user_country === 'undefined')}
              errorMessage={state.errors?.user_country?.join(', ')}
            />
          </label>
        </div>

        <label className='flex flex-col gap-1 justify-center' htmlFor='user_bio'>
          <p className='text-lg font-bold'>Bio (optional):</p>
          <Textarea
            name='user_bio'
            placeholder='Tell us a bit about yourself'
          />
        </label>

        <button
          type='submit'
          className='border border-accent rounded-md px-4 py-2 text-accent mb-5 hover:bg-secondary/10 dark:hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/20'
        >
          Landlordify!
        </button>
      </form>

      <div className='flex flex-col gap-2 bg-primary/50 border rounded-b-lg p-4 items-center justify-center min-h-[4rem]'>
        {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
        <ErrorMessage state={state} />
      </div>
    </div>
  );
};

export default LandlordRegistrationForm;
