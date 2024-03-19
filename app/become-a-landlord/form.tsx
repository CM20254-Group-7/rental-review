'use client';

import { useFormState } from 'react-dom';
import React from 'react';
import { State, addToLandlordDB } from './actions';

// Only handles general errors
const ErrorMessage: React.FC<{ state: State }> = ({ state }) => <p>{state.message}</p>;

interface LandlordRegistrationFormProps {
    userId: string;
  }

const LandlordRegistrationForm: React.FC<LandlordRegistrationFormProps> = ({
  userId,
}) => {
  const addtoLandlordDBwithId = addToLandlordDB.bind(null, userId);
  const initialState = { errors: {}, message: null };
  const [state, dispatch] = useFormState(addtoLandlordDBwithId, initialState);

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
        <label className='flex flex-col gap-1 justify-center' htmlFor='user_first_name'>
          <p className='text-lg font-bold'>First Name:</p>
          <input
            className='border w-[45%]  rounded-md px-2 py-1'
            type='text'
            name='user_first_name'
            required
          />
        </label>

        <label className='flex flex-col gap-1 justify-center' htmlFor='user_last_name'>
          <p className='text-lg font-bold'>Last Name:</p>
          <input
            className='border w-[45%]  rounded-md px-2 py-1'
            type='text'
            name='user_last_name'
            required
          />
        </label>

        <label className='flex flex-col gap-1 justify-center' htmlFor='display_name'>
          <p className='text-lg font-bold'>Display name:</p>
          <input
            className='border w-[45%]  rounded-md px-2 py-1'
            type='text'
            name='display_name'
            required
          />
        </label>

        <label className='flex flex-col gap-1 justify-center' htmlFor='display_email'>
          <p className='text-lg font-bold'>Email:</p>
          <input
            className='border w-[45%]  rounded-md px-2 py-1'
            type='text'
            name='display_email'
            required
          />
        </label>

        <label className='flex flex-col gap-1 justify-center' htmlFor='user_phoneNb'>
          <p className='text-lg font-bold'>Phone Number:</p>
          <input
            className='border w-[45%]  rounded-md px-2 py-1'
            type='text'
            name='user_phoneNb'
            required
          />
        </label>

        <label className='flex flex-col gap-1 justify-center' htmlFor='user_postcode'>
          <p className='text-lg font-bold'>Postcode:</p>
          <input
            className='border w-[45%]  rounded-md px-2 py-1'
            type='text'
            name='user_postcode'
            required
          />
        </label>

        <label className='flex flex-col gap-1 justify-center' htmlFor='user_country'>
          <p className='text-lg font-bold'>Country:</p>
          <input
            className='border w-[45%]  rounded-md px-2 py-1'
            type='text'
            name='user_country'
            required
          />
        </label>

        <label className='flex flex-col gap-1 justify-center' htmlFor='user_county'>
          <p className='text-lg font-bold'>County (optional):</p>
          <input
            className='border w-[45%]  rounded-md px-2 py-1'
            type='text'
            name='user_county'
          />
        </label>

        <label className='flex flex-col gap-1 justify-center' htmlFor='user_city'>
          <p className='text-lg font-bold'>City (optional):</p>
          <input
            className='border w-[45%]  rounded-md px-2 py-1'
            type='text'
            name='user_city'
          />
        </label>

        <label className='flex flex-col gap-1 justify-center' htmlFor='user_street'>
          <p className='text-lg font-bold'>Street (optional):</p>
          <input
            className='border w-[45%]  rounded-md px-2 py-1'
            type='text'
            name='user_street'
          />
        </label>

        <label className='flex flex-col gap-1 justify-center' htmlFor='user_house'>
          <p className='text-lg font-bold'>Address:</p>
          <input
            className='border w-[45%]  rounded-md px-2 py-1'
            type='text'
            name='user_house'
            required
          />
        </label>

        <label className='flex flex-col gap-1 justify-center' htmlFor='user_bio'>
          <p className='text-lg font-bold'>Bio (optional):</p>
          <input
            className='border w-[90%] rounded-md px-2 py-1'
            type='text'
            name='user_bio'
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
