import { cookies } from 'next/headers';
import { cache } from 'react';

import useClient from '@/utils/supabase/server';
import { NextPage } from 'next';
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

const getAllOwners = cache(async (
  propertyId: string,
): Promise<{
  start_date: Date,
  end_date: Date | null,
  landlord: LandlordProfile
}[]> => {
  'use server';

  const cookieStore = cookies();
  const supabase = useClient(cookieStore);

  // get the ownership history
  const { data } = await supabase
    .from('property_ownership')
    .select('landlord_id, started_at, ended_at')
    .eq('property_id', propertyId);

  if (!data || data.length === 0) return [];

  // get the landlord profiles for each ownership
  const profiles = await Promise.all(data.map(async (ownership) => {
    const { data: landlordProfile } = await supabase
      .from('landlord_public_profiles')
      .select('*')
      .eq('user_id', ownership.landlord_id)
      .single();

    if (!landlordProfile) return null;

    return {
      start_date: new Date(ownership.started_at),
      end_date: ownership.ended_at ? new Date(ownership.ended_at) : null,
      landlord: landlordProfile,
    };
  }));

  // remove any nulls & return
  return profiles.flatMap((profile) => profile || []);
});

const OwnershipHistoryPage: NextPage<{ params: { id: string } }> = async ({ params: { id: propertyId } }) => {
  const ownershipHistory = await getAllOwners(propertyId);

  return (
    <div className='flex-1 flex flex-col justify-center text-center gap-4'>
      <h1>Ownership History</h1>
      <p>WIP</p>
      <div className='flex flex-col border rounded-lg p-4'>
        {ownershipHistory.map((ownership) => (
          <Link
            className='flex flex-col border rounded-md px-4 py-2 hover:bg-foreground/5 hover:shadow-md transition-all'
            href={`/profiles/${ownership.landlord.user_id}`}
            key={ownership.start_date.toISOString()}
          >
            <h2>
              {ownership.start_date.toLocaleDateString()}
              {' '}
              to
              {ownership.end_date ? ` ${ownership.end_date.toLocaleDateString()}` : ' Present'}
            </h2>
            <h3>{ownership.landlord.display_name}</h3>
            <p>{ownership.landlord.bio}</p>
          </Link>
        ))}
      </div>
      <Link
        className='underline hover:font-semibold  transition-all'
        href={`/properties/${propertyId}/claim`}
      >
        Claim This Property
      </Link>
      <Link
        className='underline hover:font-semibold  transition-all'
        href={`/properties/${propertyId}`}
      >
        Back to Property
      </Link>
    </div>
  );
};

export default OwnershipHistoryPage;
