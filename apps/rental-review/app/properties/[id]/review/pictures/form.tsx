'use client';

import { FC } from 'react';
import { useFormState } from 'react-dom';

import { uploadPictures } from './actions';

const AddPictureForm: FC<{
  property_id: string;
}> = ({property_id }) => {

  const [state, dispatch] = useFormState(uploadPictures.bind(null, property_id), {});
  let error_message = state.error ? JSON.stringify(state.error, null, '\t') : '';
  error_message = error_message.substring(1, error_message.length - 1);

  console.log(state);
  return (
    <form
      className='place-items-center mb-8 flex w-full max-w-prose flex-col gap-2 rounded-md border p-4'
      action={dispatch}
    >
      <p>Please upload your pictures one by one</p>
      <input
        className='rounded-md border p-2'
        type='file'
        name='pictures'
      />
      <button
        className='rounded-md border p-2 hover:bg-gray-600/20'
        type='submit'
      >
        Upload Picture
      </button>

      {state.message != null && <p>Success!</p>}
      {state.error && <p>{error_message}</p>}
    </form>
  );
};

export default AddPictureForm;
