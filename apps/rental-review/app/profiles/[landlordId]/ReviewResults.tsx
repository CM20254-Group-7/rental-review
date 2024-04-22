import { ReviewDetailsLayout } from '@/components/ReviewDetails';
import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import React, { cache } from 'react';

const getReviews = cache(async (landlordId: string) => {
  const supabase = createServerSupabaseClient();

  const { data: reviews } = await supabase
    .rpc('reviews_for_landlord', { id: landlordId })
    .select('*');

  if (!reviews) return [];

  const extendedReviews = (
    await Promise.all(
      reviews.map(async (review) => {
        const { data: reviewTags, error: tagError } = await supabase
          .from('review_tags')
          .select('tag')
          .eq('review_id', review.review_id);

        const underReview =
          (
            await supabase.rpc('under_review', {
              r_id: review.review_id,
            })
          ).data ?? false;
        if (tagError) return [];

        return {
          ...review,
          review_tags: reviewTags.map((tag) => tag.tag),
          under_review: underReview,
        };
      }),
    )
  ).flat();

  return extendedReviews;
});

const ReviewResults: React.FC<{
  landlordId: string;
}> = async ({ landlordId }) => {
  const reviews = await getReviews(landlordId);

  if (reviews.length === 0) return <p>No reviews found</p>;

  return reviews.map((review) => (
    <ReviewDetailsLayout
      key={review.review_id}
      propertyId={review.property_id}
      reviewId={review.review_id}
      reviewDate={review.review_date}
      reviewMessage={review.review_body}
      landlordRating={review.landlord_rating}
      propertyRating={review.property_rating}
      reviewTags={review.review_tags}
      underReview={review.under_review}
    />
  ));
};

export default ReviewResults;

export const ReviewResultsLoading: React.FC = () => <p>Loading...</p>;
