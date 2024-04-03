'use client';

import React, { useEffect, useState } from 'react';
import { BarList } from '@tremor/react';
import StarRatingLayout from '@/components/StarRating';

const ratingData = (data: { stars: number; count: number; }[]) => data.map(({ stars, count }) => ({
  name: `${' '.repeat(stars)}`,
  value: count,
  icon: () => <div className='mr-4'><StarRatingLayout rating={stars} /></div>,
}));

const RatingList: React.FC<{data: {stars: number; count: number;}[] }> = ({ data }) => {
  const [ratings, setRatings] = useState<{ name: string; value: number; icon:() => React.JSX.Element }[]>(ratingData(data));
  useEffect(() => {
    setRatings(ratingData(data));
  }, [data]);

  return (
    <BarList
      data={ratings}
      color='primary'
      className='mx-auto max-w-sm'
    />
  );
};

export default RatingList;
