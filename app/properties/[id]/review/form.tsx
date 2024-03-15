'use client';

import { Combobox } from '@headlessui/react';
import { FC, useState } from 'react';
import { useFormState } from 'react-dom';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { createReview } from './actions';

const CreateReviewForm: FC<{
  propertyId: string;
  tags: string[];
}> = ({ propertyId, tags }) => {
  const createReviewWithProperty = createReview.bind(null, propertyId);
  const [state, dispatch] = useFormState(createReviewWithProperty, {});

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagQuery, setTagQuery] = useState('');

  const filteredTags = tagQuery === ''
    ? tags
    : tags.filter((tag) => tag.toLowerCase().includes(tagQuery.toLowerCase()));

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

      {selectedTags.length > 0 && (
        selectedTags.map((tag) => (
          <button
            key={tag}
            className='flex flex-row items-center w-fit border p-2 rounded-md ml-4 bg-transparent'
            type='button'
            onClick={(e) => {
              e.preventDefault();

              setSelectedTags(selectedTags.filter((t) => t !== tag));
            }}
          >
            <input
              readOnly
              type='hidden'
              name='tags'
              value={tag}
            />
            <XMarkIcon className='w-4 h-4 text-red-400' />
            {tag}
          </button>
        ))
      )}

      <Combobox
        as='div'
        className='relative flex flex-col border rounded-md ml-4 bg-transparent'
        value={selectedTags}
        onChange={setSelectedTags}
        name='tags'
      >
        <div className='flex flex-row gap-2 w-full p-2'>
          <p>Tags: </p>
          <Combobox.Input as='input' className='bg-transparent w-full' onChange={(e) => setTagQuery(e.target.value)} />
        </div>
        <Combobox.Options as='div' className='absolute top-9 bg-background w-full border rounded-b'>
          {filteredTags.map((tag) => (
            <Combobox.Option
              onClick={(e) => {
                e.preventDefault();
                setSelectedTags([...selectedTags, tag]);
              }}
              as='button'
              key={tag}
              value={tag}
              className='flex flex-row justify-between p-2 w-full text-left odd:bg-foreground/10 hover:bg-foreground/20 border-t'
            >
              {({ selected }) => (
                <div className='contents'>
                  <div>
                    {selected && <CheckIcon className='w-4 h-4 text-green-500' />}
                  </div>
                  {tag}
                </div>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>

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
