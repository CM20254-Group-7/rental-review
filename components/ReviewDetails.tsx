'use Server';

import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import React from 'react';
import StarRatingLayout from './StarRating';

interface MaybeLinkProps {
  conditionMet: boolean
  link: string
  children: React.ReactNode
  className?: string
}
const MaybeLink: React.FC<MaybeLinkProps> = ({
  conditionMet,
  link,
  children,
  className,
}) => {
  if (conditionMet) {
    return (
      <Link
        href={link}
        className={className}
      >
        {children}
      </Link>
    );
  }
  return (
    <div className={className}>
      {children}
    </div>
  );
};

MaybeLink.defaultProps = {
  className: '',
};

type Review = {
  reviewId: string
  // reviewerId: string
  reviewDate: Date
  landlordRating: number
  propertyRating: number
  reviewMessage: string
  reviewTags: string[]
}

interface ReviewDetailsLayoutProps extends Review {
  link?: boolean
}
// export seperately to allow pages that already have the data to use the standardised layout
export const ReviewDetailsLayout: React.FC<ReviewDetailsLayoutProps> = ({
  reviewId,
  // reviewerId,
  reviewDate,
  landlordRating,
  propertyRating,
  reviewMessage,
  reviewTags,
  link = false,
}) => (
  <MaybeLink
    conditionMet={link}
    link={`/review/${reviewId}`}
    className='flex flex-1 flex-col px-8 py-2 sm:px-4 border rounded-lg h-fit w-full max-w-prose justify-center place-items-center'
  >
    {/* <h1>Review Details</h1> */}
    {/* <p>Review ID: {reviewId}</p> */}
    {/* <p>Reviewer ID: {reviewerId}</p> */}
    <div className='flex flex-col w-full sm:w-4/5 gap-4'>

      <div className='flex flex-col sm:flex-row justify-around place-items-center'>
        <div className='flex flex-col'>
          <p className='text-lg font-semibold'>Property:</p>
          <StarRatingLayout rating={propertyRating} />
        </div>

        <div className='flex flex-col'>
          <p className='text-lg font-semibold'>Landlord:</p>
          <StarRatingLayout rating={landlordRating} />
        </div>
      </div>

      <div className='flex flex-col w-full gap-2'>
        <p className='text-lg font-semibold'>Review:</p>
        <p className='border rounded-md h-fit min-h-[5rem] bg-gray-100/10 py-1 px-2'>{reviewMessage}</p>
      </div>

      <div className='flex flex-wrap gap-2'>
        {reviewTags.map((tag) => (
          <span key={tag} className='border rounded-md px-2 py-1 bg-secondary/20'>{tag}</span>
        ))}
      </div>

      <p className='ml-auto text-gray-300'>{reviewDate.toLocaleDateString()}</p>

    </div>
  </MaybeLink>
);
ReviewDetailsLayout.defaultProps = {
  link: false,
};

interface ReviewDetailsProps {
  reviewId: string
  link?: boolean
}
export const ReviewDetails: React.FC<ReviewDetailsProps> = async ({
  reviewId,
  link = false,
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('reviews')
    .select('*, review_tags(tag)')
    .eq('review_id', reviewId)
    .single();

  if (error || !data) {
    return null;
  }

  return (
    <ReviewDetailsLayout
      reviewId={reviewId}
      // reviewerId={data.review_id}
      reviewDate={new Date(data.review_date)}
      landlordRating={data.landlord_rating}
      propertyRating={data.property_rating}
      reviewMessage={data.review_body}
      reviewTags={data.review_tags.map((reviewTag) => reviewTag.tag)}
      link={link}
    />
  );
};
