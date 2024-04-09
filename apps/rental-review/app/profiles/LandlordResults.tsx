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
    return <div>No landlords found</div>;
  }

  return (
    <div className='grid grid-cols-1 gap-4'>
      {landlords.map((landlord, index) => (
        <div
          key={landlord.user_id}
          className='mb-4 flex items-center justify-between'
        >
          <div className='flex w-full items-center'>
            {/* Rank Number Column */}
            <div className='w-12 text-center'>
              {/* Ranking with Crown */}
              <span className='text-xl font-semibold'>
                {index < 3 ? '👑 ' : ''}
                {index + 1}.
              </span>
            </div>
            {/* Landlord Details Column */}

            <div className='w-full pl-4'>
              <Link href={`/profiles/${landlord.user_id}`}>
                <div className='bg-secondary/10 hover:bg-secondary/20 shadow-secondary/40 hover:shadow-secondary/40 relative flex w-full flex-col items-center gap-4 rounded-xl border p-6 pb-8 shadow-md hover:shadow-lg'>
                  <div className='flex items-center'>
                    <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
                      {landlord.display_name}
                    </h2>
                  </div>
                  {/* Card Body */}
                  <div className='flex w-full flex-col items-center gap-2'>
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
