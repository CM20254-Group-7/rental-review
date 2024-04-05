import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import React, { cache } from 'react';

interface landlordPublicProfile {
  bio: string | null;
  display_email: string;
  display_name: string;
  profile_image_id: string | null;
  type: string;
  user_id: string;
  verified: boolean;
  website: string | null;
}
const getCurrentOwner = cache(async (propertyId: string): Promise<landlordPublicProfile | null> => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('property_ownership')
    .select('landlord_public_profiles(*)')
    .eq('property_id', propertyId)
    .is('ended_at', null)
    .maybeSingle();

  if (error || !data || !data.landlord_public_profiles) return null;

  return data.landlord_public_profiles;
});
export const OwnershipDetails: React.FC<{
  propertyId: string;
}> = async ({ propertyId }) => {
  const currentLandlord = await getCurrentOwner(propertyId);

  if (!currentLandlord) {
    return (
      <p>Unknown</p>
    );
  }

  const landlordName = currentLandlord.display_name;

  return (
    <p>{landlordName}</p>
  );
};

export default OwnershipDetails;
