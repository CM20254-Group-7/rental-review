'use Server';

import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import Link from 'next/link';
import React from 'react';
import { Badge } from '@tremor/react';
import StarRatingLayout from './StarRating';

interface MaybeLinkProps {
  conditionMet: boolean;
  link: string;
  children: React.ReactNode;
  className?: string;
}
const MaybeLink: React.FC<MaybeLinkProps> = ({
  conditionMet,
  link,
  children,
  className,
}) => {
  if (conditionMet) {
    return (
      <Link href={link} className={className}>
        {children}
      </Link>
    );
  }
  return <div className={className}>{children}</div>;
};

MaybeLink.defaultProps = {
  className: '',
};

type AboutYouBadgeProps =
  | { knownOwner: true; isOwner: boolean }
  | { knownOwner: false; propertyId: string; reviewDate: string };
const AboutYouBadge: React.FC<AboutYouBadgeProps> = async (props) => {
  const userIsOwner = async () => {
    const { knownOwner } = props;
    if (knownOwner) {
      const { isOwner } = props;
      return isOwner;
    }
    const { propertyId, reviewDate } = props;

    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: landlordForReview } = await supabase.rpc(
      'property_owner_on_date',
      {
        property_id: propertyId,
        query_date: reviewDate,
      },
    );

    // console.log('landlordForReview', landlordForReview, error);

    // console.log(
    //   props,
    //   user.id,
    //   landlordForReview,
    //   landlordForReview == user.id,
    // );

    return landlordForReview === user.id;
  };

  const showBadge = await userIsOwner();

  if (!showBadge) return null;
  return <Badge>About You</Badge>;
};

type Review = {
  reviewId: string;
  propertyId: string;
  reviewDate: string;
  landlordRating: number;
  propertyRating: number;
  reviewMessage: string;
  reviewTags: string[];
};

interface ReviewDetailsLayoutProps extends Review {
  aboutActiveLandlord?: boolean;
  link?: boolean;
  showReportButton?: boolean;
}
// export separately to allow pages that already have the data to use the standardised layout
export const ReviewDetailsLayout: React.FC<ReviewDetailsLayoutProps> = async ({
  reviewId,
  propertyId,
  reviewDate,
  landlordRating,
  propertyRating,
  reviewMessage,
  reviewTags,
  aboutActiveLandlord,
  link = false,
  showReportButton = true,
}) => {
  const aboutYouProps: AboutYouBadgeProps =
    typeof aboutActiveLandlord === 'undefined'
      ? {
          knownOwner: false,
          propertyId,
          reviewDate,
        }
      : { knownOwner: true, isOwner: aboutActiveLandlord };

  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentReviewId = null;

  if (user) {
    const { data: reviewerData } = await supabase
      .from('reviewer_private_profiles')
      .select('reviewer_id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .single();

    if (reviewerData) {
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('review_id')
        .eq('reviewer_id', reviewerData.reviewer_id)
        .single();

      if (reviewData) {
        currentReviewId = reviewData.review_id;
      }
    }
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('*, review_tags(tag)')
    .eq('review_id', reviewId)
    .single();

  if (error || !data) {
    return null;
  }
  return (
    <MaybeLink
      conditionMet={link}
      link={`/review/${reviewId}`}
      className='flex h-fit w-full max-w-prose flex-1 flex-col place-items-center justify-center rounded-lg border px-8 py-2 sm:px-4'
    >
      {/* <h1>Review Details</h1> */}
      {/* <p>Review ID: {reviewId}</p> */}
      {/* <p>Reviewer ID: {reviewerId}</p> */}
      <div className='flex w-full flex-col gap-4 sm:w-4/5'>
        <div className='flex flex-col place-items-center justify-around sm:flex-row'>
          <div className='flex flex-col'>
            <p className='text-lg font-semibold'>Property:</p>
            <StarRatingLayout rating={propertyRating} />
          </div>

          <div className='flex flex-col'>
            <p className='text-lg font-semibold'>Landlord:</p>
            <StarRatingLayout rating={landlordRating} />
          </div>
        </div>

        <div className='flex w-full flex-col gap-2'>
          <p className='text-lg font-semibold'>Review:</p>
          <p className='h-fit min-h-[5rem] rounded-md border bg-gray-100/10 px-2 py-1'>
            {reviewMessage}
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          {reviewTags.map((tag) => (
            <span
              key={tag}
              className='bg-secondary/20 rounded-md border px-2 py-1'
            >
              {tag}
            </span>
          ))}
        </div>

        <p className='text-foreground/50 ml-auto'>
          {new Date(reviewDate).toLocaleDateString()}
        </p>

        <div className='flex flex-row'>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <AboutYouBadge {...aboutYouProps} />
          {showReportButton && (
            <Link
              href={`/reviews/${reviewId}/report`}
              className='ml-auto text-red-500/70 underline hover:text-red-500'
            >
              Report
            </Link>
          )}
        </div>

        <div className='flex flex-1 flex-col place-items-center items-center justify-center'>
          {reviewId === currentReviewId && (
            <>
              <p>This is your review.</p>
              <Link href={`/properties/${propertyId}/${reviewId}`}>
                <button
                  type='button'
                  className='text-blue-500/70 underline hover:text-blue-500'
                >
                  Add Pictures
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </MaybeLink>
  );
};
ReviewDetailsLayout.defaultProps = {
  link: false,
  showReportButton: true,
};

interface ReviewDetailsProps {
  reviewId: string;
  link?: boolean;
  showReportButton?: boolean;
}
export const ReviewDetails: React.FC<ReviewDetailsProps> = async ({
  reviewId,
  link = false,
  showReportButton = true,
}) => {
  const supabase = createServerSupabaseClient();

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
      propertyId={data.property_id}
      reviewDate={data.review_date}
      landlordRating={data.landlord_rating}
      propertyRating={data.property_rating}
      reviewMessage={data.review_body}
      reviewTags={data.review_tags.map((reviewTag) => reviewTag.tag)}
      aboutActiveLandlord={false}
      link={link}
      showReportButton={showReportButton}
    />
  );
};
