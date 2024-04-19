'use client';

import { FC } from 'react';
import { useFormState } from 'react-dom';

import { uploadPictures } from './actions';

const AddPictureForm: FC<{
  property_id: string;
  review_id: string;
}> = ({ property_id, review_id }) => {
  const [state, dispatch] = useFormState(
    uploadPictures.bind(null, property_id, review_id),
    {},
  );

  let errorMessage = state.error ? JSON.stringify(state.error, null, '\t') : '';
  errorMessage = errorMessage.substring(1, errorMessage.length - 1);

  return (
    <form
      className='mb-8 flex w-full max-w-prose flex-col place-items-center gap-2 rounded-md p-4'
      action={dispatch}
    >
      <input
        className='rounded-md border p-2'
        name='pictures'
        type='file'
        accept='image/*'
      />
      <button
        className='rounded-md border p-2 hover:bg-gray-600/20'
        type='submit'
      >
        Upload Picture
      </button>

      <br />

      <p>Accepted formats: .jpg, .png, and .gif</p>
      <p>Please upload your pictures one by one.</p>

      <br />

      {state.message != null && <p className='text-green-600'>Success!</p>}
      {state.error && <p className='text-red-500'>{errorMessage}</p>}
    </form>
  );
};

export default AddPictureForm;
