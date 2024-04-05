import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import StarRatingLayout from '@/components/StarRating';
import React, { cache } from 'react';

const getAverageLandlordRating = cache(async (landlordId: string): Promise<number | null> => {
  const supabase = createClient(cookies());

  const { data, error } = await supabase
    .rpc('average_landlord_rating', { id: landlordId });

  if (error) return null;

  return data;
});

const AverageLandlordRating: React.FC<{ landlordId: string; }> = async ({ landlordId }) => {
  const averageRating = await getAverageLandlordRating(landlordId);

  if (!averageRating) {
    return (
      <p>No Ratings yet</p>
    );
  }

  return (
    <StarRatingLayout rating={averageRating} />
  );
};

export default AverageLandlordRating;
