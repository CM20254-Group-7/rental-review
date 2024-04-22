import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { ReviewDetailsLayout } from '@/components/ReviewDetails';
import React, { cache } from 'react';

const getReviewResults = cache(async (propertyId: string) => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('full_reviews')
    .select('*')
    .eq('property_id', propertyId);

  if (error) return [];

  const reviewDetails = data.map((review) => ({
    ...review,
    review_tags: review.tags?.map((reviewTag) => reviewTag) ?? [],
    under_review: review.under_review ?? false,
  }));

  return reviewDetails;
});

const ReviewResults: React.FC<{ propertyId: string }> = async ({
  propertyId,
}) => {
  const reviewResults = await getReviewResults(propertyId);

  if (reviewResults.length === 0) {
    return <p>No Reviews yet</p>;
  }

  return reviewResults.map((reviewDetails) => (
    <ReviewDetailsLayout
      key={reviewDetails.review_id}
      reviewId={reviewDetails.review_id}
      propertyId={reviewDetails.property_id}
      reviewDate={reviewDetails.review_date}
      landlordRating={reviewDetails.landlord_rating}
      propertyRating={reviewDetails.property_rating}
      reviewMessage={reviewDetails.review_body}
      reviewTags={reviewDetails.review_tags}
      underReview={reviewDetails.under_review}
    />
  ));
};

export default ReviewResults;
