import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import Link from 'next/link';
import React, { cache } from 'react';
import StarRatingLayout from '@/components/StarRating';

const getLandlordResults = cache(async () => {
  const supabase = createServerSupabaseClient();

  const { data: landlords, error: landlordsError } = await supabase
    .rpc('landlord_public_profiles_with_ratings')
    .gte('average_rating', 0)
    .order('average_rating', { ascending: false })
    .limit(10);

  if (landlordsError) {
    return {
      landlords: [],
    };
  }

  return {
    landlords: landlords || [],
  };
});

const LandlordResults: React.FC = async () => {
  const { landlords } = await getLandlordResults();

  if (landlords.length === 0) {
    return (
      <div>
        No landlords found
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4'>
      {landlords.map((landlord, index) => (
        <div key={landlord.user_id} className='flex items-center justify-between mb-4'>
          <div className='w-full flex items-center'>
            {/* Rank Number Column */}
            <div className='w-12 text-center'>
              {/* Ranking with Crown */}
              <span className='text-xl font-semibold'>
                {index < 3 ? '👑 ' : ''}
                {index + 1}
                .
              </span>
            </div>
            {/* Landlord Details Column */}

            <div className='w-full pl-4'>
              <Link href={`/profiles/${landlord.user_id}`}>
                <div
                  className='flex flex-col w-full items-center rounded-xl bg-secondary/10 hover:bg-secondary/20 p-6 pb-8 gap-4 border shadow-md shadow-secondary/40 hover:shadow-lg hover:shadow-secondary/40 relative'
                >
                  <div className='flex items-center'>
                    <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>{landlord.display_name}</h2>
                  </div>
                  {/* Card Body */}
                  <div className='flex flex-col w-full gap-2 items-center'>
                    <StarRatingLayout rating={landlord.average_rating} />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LandlordResults;
