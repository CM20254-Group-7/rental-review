import React, { cache } from 'react';
import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';

type LandlordProfile = {
  bio: string | null;
  display_email: string;
  display_name: string;
  profile_image_id: string | null;
  type: string;
  user_id: string;
  verified: boolean;
  website: string | null;
  average_rating: number | null;
};

const getCurrentOwner = cache(
  async (propertyId: string): Promise<LandlordProfile | null> => {
    'use server';

    const supabase = createServerSupabaseClient();

    const { data: currentOwnerId } = await supabase
      .from('property_ownership')
      .select('landlord_id')
      .eq('property_id', propertyId)
      .is('ended_at', null)
      .maybeSingle();

    if (!currentOwnerId) return null;

    const { data } = await supabase
      .rpc('landlord_public_profiles_with_ratings')
      .eq('user_id', currentOwnerId.landlord_id)
      .select('*')
      .single();

    return data;
  },
);

const CurrentOwnerIndicator: React.FC<{ propertyId: string }> = async ({
  propertyId,
}) => {
  const currentOwner = await getCurrentOwner(propertyId);

  return (
    <>
      <div className='flex flex-width px-2 py-1 hover:bg-secondary/10'>
        {currentOwner ? (
          <Link
            className='flex w-full min-w-[12rem] flex-row gap-2 justify-between items-baseline'
            href={`/profiles/${currentOwner.user_id}`}
            style={{ flexGrow: 1 }}
          >
            <p>{currentOwner.display_name}</p>
            {currentOwner.average_rating && (
              <div className='flex w-fit flex-row items-center gap-1'>
                <p className='pt-1'>{currentOwner.average_rating.toFixed(1)}</p>
                <StarIcon className='h-5 w-5 text-yellow-300' />
              </div>
            )}
          </Link>
        ) : (
          'Unknown'
        )}
      </div>

      <div className='flex flex-col text-center'>
        <div className='flex px-2 py-1 border-t w-full flex-1 justify-center'>
          <Link
            className='text-sm hover:underline'
            href={`/properties/${propertyId}/ownership-history`}
          >
            View ownership history/claim property
          </Link>
        </div>
      </div>
    </>
  );
};

export default CurrentOwnerIndicator;
