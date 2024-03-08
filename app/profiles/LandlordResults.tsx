import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import React, { cache } from 'react';
import Image from 'next/image';

const getLandlordResults = cache(async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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
    <div>
      {landlords.map((landlord, index) => (
        <div key={landlord.user_id} className='flex items-center justify-between mb-4'>
          {/* Ranking with Crown */}
          <span className='text-xl font-semibold mr-2'>
            {index < 3 && '👑 '}
            {index + 1}
            .
          </span>
          {/* Landlord Details */}
          <Link href={`/profiles/${landlord.user_id}`}>
            <div
              className='flex flex-col w-full items-center rounded-xl bg-secondary/10 hover:bg-secondary/20 p-6 pb-8 gap-4 border shadow-md shadow-secondary/40 hover:shadow-lg hover:shadow-secondary/40 relative'
            >
              <div className='flex items-center'>
                <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>{landlord.display_name}</h2>
              </div>

              {/* Card Body */}
              <div className='flex flex-col w-full gap-2'>
                <p>{landlord.bio}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default LandlordResults;
