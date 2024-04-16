import { cache } from 'react';
import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { NextPage } from 'next';
import Link from 'next/link';
import StarRatingLayout from '@/components/StarRating';

type LandlordProfile = {
  bio: string | null;
  display_email: string;
  display_name: string;
  profile_image_id: string | null;
  type: string;
  user_id: string;
  verified: boolean;
  website: string | null;
};

const getAllOwners = cache(
  async (
    propertyId: string,
  ): Promise<
    {
      start_date: Date;
      end_date: Date | null;
      landlord: LandlordProfile;
      average_rating: number;
    }[]
  > => {
    'use server';

    const supabase = createServerSupabaseClient();

    // get the ownership history
    const { data } = await supabase
      .from('property_ownership')
      .select('landlord_id, started_at, ended_at')
      .eq('property_id', propertyId);

    if (!data || data.length === 0) return [];

    // get the landlord profiles for each ownership
    const profiles = await Promise.all(
      data.map(async (ownership) => {
        const { data: landlordProfile } = await supabase
          .from('landlord_public_profiles')
          .select('*')
          .eq('user_id', ownership.landlord_id)
          .single();

        if (!landlordProfile) return null;

        const { data: rating } = await supabase.rpc('average_landlord_rating', {
          id: ownership.landlord_id,
        });

        let averageRating = 0;
        if (rating) {
          averageRating = rating;
        }

        return {
          start_date: new Date(ownership.started_at),
          end_date: ownership.ended_at ? new Date(ownership.ended_at) : null,
          landlord: landlordProfile,
          average_rating: averageRating,
        };
      }),
    );

    // remove any nulls & return
    return profiles.flatMap((profile) => profile || []);
  },
);

const OwnershipHistoryPage: NextPage<{ params: { id: string } }> = async ({
  params: { id: propertyId },
}) => {
  const ownershipHistory = await getAllOwners(propertyId);

  return (
    <main className='flex w-full flex-1 flex-col place-items-center py-10 md:py-16'>
      <div className='flex w-full max-w-prose flex-col items-center gap-8'>
        <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
          Ownership History
        </h2>
        <span className='border-accent w-full border border-b' />
        {ownershipHistory.map((ownership) => (
          <Link
            className='bg-secondary/10 hover:bg-secondary/20 shadow-secondary/40 hover:shadow-secondary/40 flex w-fit min-w-[25rem] flex-col items-center gap-4 rounded-xl border p-6 pb-8 shadow-md hover:shadow-lg'
            href={`/profiles/${ownership.landlord.user_id}`}
            key={ownership.start_date.toISOString()}
          >
            {/* Timeline */}
            <div className='flex w-fit flex-col'>
              <h2 className='mb-1 w-fit text-2xl font-semibold'>
                {ownership.start_date.toLocaleDateString()} to{' '}
                {ownership.end_date
                  ? ` ${ownership.end_date.toLocaleDateString()}`
                  : ' Present'}
              </h2>
            </div>

            {/* Landlord details */}
            <div className='flex flex-col items-center justify-center'>
              {' '}
              {/* Changed flex to flex-col */}
              <div className='text-center'>
                {' '}
                {/* Container for landlord's name */}
                <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
                  {ownership.landlord.display_name}
                </h2>
              </div>
              <div className='text-center'>
                {' '}
                {/* Container for star rating */}
                <StarRatingLayout rating={ownership.average_rating} />
              </div>
            </div>
          </Link>
        ))}

        <div className='flex justify-center'>
          <Link
            className='mr-4 underline transition-all hover:font-semibold'
            href={`/properties/${propertyId}/claim`}
          >
            Claim This Property
          </Link>
          <Link
            className='underline transition-all hover:font-semibold'
            href={`/properties/${propertyId}`}
          >
            Back to Property
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OwnershipHistoryPage;
