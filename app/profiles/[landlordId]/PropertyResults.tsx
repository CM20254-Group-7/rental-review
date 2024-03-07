import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import React from 'react';

const getCurrentlyOwnedProperties = async (landlordId: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: landlordCurrentProperties } = await supabase
    .from('property_ownership')
    .select('property_id')
    .eq('landlord_id', landlordId)
    .is('ended_at', null);

  const { data: currentPropertyDetails } = await supabase
    .rpc('properties_full')
    .in('id', (landlordCurrentProperties || []).map((property) => property.property_id))
    .select('*');

  return currentPropertyDetails || [];
};

const getPreviouslyOwnedProperties = async (landlordId: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: landlordPreviousProperties } = await supabase
    .from('property_ownership')
    .select('property_id')
    .eq('landlord_id', landlordId)
    .not('ended_at', 'is', null);

  const { data: PreviousPropertyDetails } = await supabase
    .rpc('properties_full')
    .in('id', (landlordPreviousProperties || []).map((property) => property.property_id))
    .select('*');

  return PreviousPropertyDetails || [];
};

const PropertyResult: React.FC<{
  address: string;
  id: string;
  key: string;
}> = ({ address, id, key }) => (
  <Link
    className='flex flex-col w-fit min-w-[25rem] items-center rounded-xl bg-secondary/10 hover:bg-secondary/20 p-6 pb-8 gap-4 border shadow-md shadow-secondary/40 hover:shadow-lg hover:shadow-secondary/40'
    href={`/properties/${id}`}
    key={key}
  >
    {/* Card Header */}
    <div className='flex flex-col w-fit'>
      <h2 className='text-2xl font-semibold mb-1 w-fit'>{address}</h2>
    </div>
  </Link>
);

export const CurrentPropertyResults: React.FC<{ landlordId: string }> = async ({ landlordId }) => {
  const currentProperties = await getCurrentlyOwnedProperties(landlordId);

  if (currentProperties.length === 0) return <p>No properties are currently owned by this landlord</p>;

  return currentProperties.map((property) => (
    <PropertyResult
      key={property.address}
      address={property.address}
      id={property.id}
    />
  ));
};

export const PreviousPropertyResults: React.FC<{ landlordId: string }> = async ({ landlordId }) => {
  const previousProperties = await getPreviouslyOwnedProperties(landlordId);

  if (previousProperties.length === 0) return <p>No properties have previously been owned by this landlord</p>;

  return previousProperties.map((property) => (
    <PropertyResult
      key={property.address}
      address={property.address}
      id={property.id}
    />
  ));
};

export const PropertyResultsLoading: React.FC = () => <p>Loading...</p>;
