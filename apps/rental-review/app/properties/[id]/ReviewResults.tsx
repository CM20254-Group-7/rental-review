import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { ReviewDetailsLayout } from '@/components/ReviewDetails';
import React, { cache } from 'react';

interface ReviewDetails {
  landlord_rating: number;
  property_id: string;
  property_rating: number;
  review_body: string;
  review_date: Date;
  review_id: string;
  reviewer_id: string;
  review_tags: string[];
}
const getReviewResults = cache(async (propertyId: string): Promise<ReviewDetails[]> => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('reviews')
    .select('*, review_tags(tag)')
    .eq('property_id', propertyId);

  if (error) return [];

  return data.map((review) => ({
    ...review,
    review_date: new Date(review.review_date),
    review_tags: review.review_tags.map((reviewTag) => reviewTag.tag),
  }));
});

const ReviewResults: React.FC<{ propertyId: string; }> = async ({ propertyId }) => {
  const reviewResults = await getReviewResults(propertyId);

  if (reviewResults.length === 0) {
    return (
      <p>No Reviews yet</p>
    );
  }

  return reviewResults.map((reviewDetails) => (
    <ReviewDetailsLayout
      key={reviewDetails.review_id}
      reviewId={reviewDetails.review_id}
      // reviewerId={reviewDetails.reviewer_id}
      reviewDate={reviewDetails.review_date}
      landlordRating={reviewDetails.landlord_rating}
      propertyRating={reviewDetails.property_rating}
      reviewMessage={reviewDetails.review_body}
      reviewTags={reviewDetails.review_tags}
    />
  ));
};

export default ReviewResults;
