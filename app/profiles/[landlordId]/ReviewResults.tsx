import { ReviewDetailsLayout } from '@/components/ReviewDetails';
import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import React, { cache } from 'react';

const getReviews = cache(async (landlordId: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: reviews } = await supabase
    .rpc('reviews_for_landlord', { id: landlordId })
    .select('*');

  return reviews?.map((review) => ({
    ...review,
    review_date: new Date(review.review_date),
  })) || [];
});

const ReviewResults: React.FC<{
  landlordId: string;
}> = async ({ landlordId }) => {
  const reviews = await getReviews(landlordId);

  return reviews.map((review) => (
    <ReviewDetailsLayout
      key={review.review_id}
      reviewId={review.review_id}
      reviewDate={review.review_date}
      reviewMessage={review.review_body}
      reviewerId={review.reviewer_id}
      landlordRating={review.landlord_rating}
      propertyRating={review.property_rating}
    />
  ));
};

export default ReviewResults;

export const ReviewResultsLoading: React.FC = () => (
  <p>Loading...</p>
);
