import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import React, { cache } from 'react';

const getLandlordResults = cache(async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: landlords, error: landlordsError } = await supabase
    .from('landlord_public_profiles')
    .select('*');

  if (landlordsError) {
    return {
      landlords: [],
    };
  }

  // Sorting landlords by display name ascending
  const sortedLandlords = landlords.sort((a, b) => a.display_name.localeCompare(b.display_name));

  return {
    landlords: sortedLandlords,
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
      {landlords.map((landlord) => (
        <React.Fragment key={landlord.user_id}>
          <Link href={`/profiles/${landlord.user_id}`}>
            <div
              className='flex flex-col w-full items-center rounded-xl bg-secondary/10 hover:bg-secondary/20 p-6 pb-8 gap-4 border shadow-md shadow-secondary/40 hover:shadow-lg hover:shadow-secondary/40'
            >
              {/* Card Header */}
              <div className='flex flex-col w-full'>
                <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>{landlord.display_name}</h2>
                <span className='border border-b w-full border-accent' />
              </div>

              {/* Card Body */}
              <div className='flex flex-col w-full gap-2'>
                <p>{landlord.bio}</p>
              </div>
            </div>
          </Link>
          <br />
        </React.Fragment>
      ))}
    </div>
  );
};

export default LandlordResults;
