import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import StarRatingLayout from '@/components/StarRating';
import React, { cache } from 'react';

const getAverageRating = cache(async (propertyId: string): Promise<number | null> => {
  const supabase = createClient(cookies());

  const { data, error } = await supabase
    .rpc('get_average_property_rating', { property_id: propertyId });

  if (error) return null;

  return data;
});

const AverageRating: React.FC<{ propertyId: string; }> = async ({ propertyId }) => {
  const averageRating = await getAverageRating(propertyId);

  if (!averageRating) {
    return (
      <p>No Ratings yet</p>
    );
  }

  return (
    <StarRatingLayout rating={averageRating} />
  );
};

export default AverageRating;
