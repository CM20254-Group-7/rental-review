'use client';

import { FC, useState } from 'react';
import {
  DatePicker,
  DatePickerValue,
  MultiSelect,
  MultiSelectItem,
  NumberInput,
  Textarea,
} from '@/components/ClientTremor';

const CreateReviewForm: FC<{
  tags: string[];
  errors:
    | {
        review_date?: string[];
        review_body?: string[];
        property_rating?: string[];
        landlord_rating?: string[];
        tags?: string[];
      }
    | undefined;
}> = ({ errors, tags }) => {
  const [reviewDate, setReviewDate] = useState<DatePickerValue>();

  return (
    <div className='contents'>
      <label htmlFor='review_date'>
        Review Date
        <input
          type='hidden'
          name='review_date'
          id='review_date'
          value={reviewDate?.toDateString()}
        />
        <DatePicker
          aria-label='Review Date'
          value={reviewDate}
          onValueChange={setReviewDate}
          enableYearNavigation
          maxDate={new Date()}
        />
      </label>

      <label htmlFor='review_body'>
        Review Body
        <Textarea
          aria-label='Review Body'
          placeholder='Write your review here'
          name='review_body'
          id='review_body'
          error={errors?.review_body !== undefined}
          errorMessage={errors?.review_body?.join(', ')}
        />
      </label>

      <label htmlFor='property_rating'>
        Property Rating
        <NumberInput
          aria-label='Property Rating'
          name='property_rating'
          id='property_rating'
          min={1}
          max={5}
          required
          placeholder='1-5'
          error={errors?.property_rating !== undefined}
          errorMessage={errors?.property_rating?.join(', ')}
        />
      </label>

      <label htmlFor='landlord_rating'>
        Landlord Rating
        <NumberInput
          aria-label='Landlord Rating'
          name='landlord_rating'
          id='landlord_rating'
          min={1}
          max={5}
          required
          placeholder='1-5'
          error={errors?.landlord_rating !== undefined}
          errorMessage={errors?.landlord_rating?.join(', ')}
        />
      </label>

      <label htmlFor='tags'>
        Tags
        <MultiSelect aria-label='Tags' name='tags'>
          {tags.map((tag) => (
            <MultiSelectItem aria-label={tag} key={tag} value={tag}>
              {tag}
            </MultiSelectItem>
          ))}
        </MultiSelect>
      </label>
    </div>
  );
};

export default CreateReviewForm;
