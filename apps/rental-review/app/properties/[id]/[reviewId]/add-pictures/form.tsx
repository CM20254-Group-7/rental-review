'use client';

import { FC, useState } from 'react';
import { useFormState } from 'react-dom';
import Image from 'next/image';

import { uploadPictures, deletePicture } from './actions';

export const AddPictureForm: FC<{
  property_id: string;
  review_id: string;
}> = ({ property_id, review_id }) => {
  const initialState = { error: '', message: null };
  const [state, dispatch] = useFormState(
    uploadPictures.bind(null, property_id, review_id),
    initialState,
  );

  const [refreshing, setRefreshing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(new FormData(e.currentTarget));
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  let errorMessage = state.error ? JSON.stringify(state.error, null, '\t') : '';
  errorMessage = errorMessage.substring(1, errorMessage.length - 1);

  return (
    <form
      className='mb-8 flex w-full max-w-prose flex-col place-items-center gap-2 rounded-md p-4'
      onSubmit={handleSubmit}
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
        disabled={refreshing}
      >
        Upload Picture
      </button>

      <br />

      <p>Accepted formats: .jpg .jpeg .png .webp .gif</p>
      <p>Please upload your pictures one by one.</p>

      <br />

      {state.message != null && <p className='text-green-600'>Success!</p>}
      {state.error && <p className='text-red-500'>{errorMessage}</p>}
    </form>
  );
};

export const DeletePictureForm: FC<{
  imageUrl: string;
}> = ({ imageUrl }) => {
  const initialState = { error: '', message: null };
  const [state, dispatch] = useFormState(
    deletePicture.bind(null, imageUrl),
    initialState,
  );

  const [refreshing, setRefreshing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch();
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <form
      className='mb-8 flex w-full max-w-prose flex-col place-items-center gap-2 rounded-md p-4'
      onSubmit={handleSubmit}
    >
      <Image
        // eslint-disable-next-line react/no-array-index-key
        key={`${imageUrl}`}
        src={imageUrl ?? ''}
        alt={`${imageUrl}`}
        width={400}
        height={100}
        className='mb-2'
      />
      <button
        className='rounded-md border p-2 hover:bg-gray-600/20'
        type='submit'
        disabled={refreshing}
      >
        Delete Above Picture
      </button>

      {state.message != null && (
        <p className='text-green-600'>{state.message}</p>
      )}
      {state.error && <p className='text-red-500'>{state.error}</p>}
    </form>
  );
};
