import React, { cache } from 'react';
import useClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';

type LandlordProfile = {
  bio: string | null;
  display_email: string;
  display_name: string;
  profile_image_id: string | null;
  type: string;
  user_id: string;
  verified: boolean;
  website: string | null;
}

const getCurrentOwner = cache(async (propertyId: string): Promise<LandlordProfile | null> => {
  'use server';

  const cookieStore = cookies();
  const supabase = useClient(cookieStore);

  const { data: currentOwnerId } = await supabase
    .rpc('property_owner_on_date', {
      property_id: propertyId,
      query_date: new Date().toISOString(),
    });

  if (!currentOwnerId) return null;

  const { data } = await supabase
    .from('landlord_public_profiles')
    .select('*')
    .eq('user_id', currentOwnerId)
    .single();

  return data;
});

const CurrentOwnerIndicator: React.FC<{ propertyId: string }> = async ({ propertyId }) => {
  const currentOwner = await getCurrentOwner(propertyId);

  return (
    <div className='flex flex-col text-center border rounded-md'>
      <div className='flex px-2 py-1 border-b w-full flex-1'>Owned by</div>
      <div className='flex px-2 py-1 w-36'>
        {currentOwner ? (
          <Link className='' href={`/profiles/${currentOwner.user_id}`}>{currentOwner.display_name}</Link>
        ) : 'Unknown'}
      </div>
      <div className='flex px-2 py-1 border-t w-full flex-1'>
        <Link className='text-sm' href={`/properties/${propertyId}/ownership-history`}>Full History & Claim</Link>
      </div>
    </div>
  );
};

export default CurrentOwnerIndicator;
