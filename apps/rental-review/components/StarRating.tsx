import { StarIcon } from '@heroicons/react/24/solid';
import React from 'react';

interface StarRatingProps {
  rating: number;
}
const StarRatingLayout: React.FC<StarRatingProps> = ({ rating }) => (
  <div className='flex' data-testid='starRating'>
    {Array.from({ length: 5 }).map((_, i) => {
      const starNumber = i + 1;
      const isFilled = starNumber <= rating;
      return (
        <StarIcon
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className={`h-6 w-6 ${isFilled ? 'text-yellow-300' : 'text-gray-400'}`}
          aria-hidden='false'
          role='img'
        />
      );
    })}
  </div>
);

export default StarRatingLayout;
