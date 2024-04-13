import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import Link from 'next/link';
import React from 'react';

const getCurrentlyOwnedProperties = async (landlordId: string) => {
  const supabase = createServerSupabaseClient();

  const { data: landlordCurrentProperties } = await supabase
    .from('property_ownership')
    .select('property_id')
    .eq('landlord_id', landlordId)
    .is('ended_at', null);

  const { data: currentPropertyDetails } = await supabase
    .rpc('properties_full')
    .in(
      'id',
      (landlordCurrentProperties || []).map((property) => property.property_id),
    )
    .select('*');

  return currentPropertyDetails || [];
};

const getPreviouslyOwnedProperties = async (landlordId: string) => {
  const supabase = createServerSupabaseClient();

  const { data: landlordPreviousProperties } = await supabase
    .from('property_ownership')
    .select('property_id')
    .eq('landlord_id', landlordId)
    .not('ended_at', 'is', null);

  const { data: PreviousPropertyDetails } = await supabase
    .rpc('properties_full')
    .in(
      'id',
      (landlordPreviousProperties || []).map(
        (property) => property.property_id,
      ),
    )
    .select('*');

  return PreviousPropertyDetails || [];
};

const PropertyResult: React.FC<{
  address: string;
  id: string;
  key: string;
}> = ({ address, id, key }) => (
  <Link
    className='bg-secondary/10 hover:bg-secondary/20 shadow-secondary/40 hover:shadow-secondary/40 flex min-w-[25rem] flex-col gap-4 rounded-xl border p-6 pb-8 shadow-md hover:shadow-lg'
    href={`/properties/${id}`}
    key={key}
  >
    {/* Card Header */}
    <div className='flex w-fit flex-col '>
      <h2 className='mb-1 w-fit text-2xl font-semibold'>{address}</h2>
    </div>
  </Link>
);

export const CurrentPropertyResults: React.FC<{ landlordId: string }> = async ({
  landlordId,
}) => {
  const currentProperties = await getCurrentlyOwnedProperties(landlordId);

  if (currentProperties.length === 0) {
    return <p>No properties are currently owned by this landlord</p>;
  }

  return currentProperties.map((property) => (
    <PropertyResult
      key={property.address}
      address={property.address}
      id={property.id}
    />
  ));
};

export const PreviousPropertyResults: React.FC<{
  landlordId: string;
}> = async ({ landlordId }) => {
  const previousProperties = await getPreviouslyOwnedProperties(landlordId);

  if (previousProperties.length === 0) {
    return <p>No properties have previously been owned by this landlord</p>;
  }

  return previousProperties.map((property) => (
    <PropertyResult
      key={property.address}
      address={property.address}
      id={property.id}
    />
  ));
};

export const PropertyResultsLoading: React.FC = () => <p>Loading...</p>;
