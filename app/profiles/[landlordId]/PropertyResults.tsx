import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
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

export const CurrentPropertyResults: React.FC<{ landlordId: string }> = async ({ landlordId }) => {
  const currentProperties = await getCurrentlyOwnedProperties(landlordId);

  if (!currentProperties) return <p>No Claimed Properties Yet</p>;

  return currentProperties.map((property) => (
    <li key={property.address}>
      <h3>{property.address}</h3>
      <p style={{ textAlign: 'center', backgroundColor: 'red' }}>NEED TO ADD LINK TO THE PROPERTY!!!</p>
    </li>
  ));
};

export const PreviousPropertyResults: React.FC<{ landlordId: string }> = async ({ landlordId }) => {
  const previousProperties = await getPreviouslyOwnedProperties(landlordId);

  if (!previousProperties) return <p>No Previous Properties</p>;

  return previousProperties.map((property) => (
    <li key={property.address}>
      <h3>{property.address}</h3>
      <p style={{ textAlign: 'center', backgroundColor: 'red' }}>NEED TO ADD LINK TO THE PROPERTY!!!</p>
    </li>
  ));
};

export const PropertyResultsLoading: React.FC = () => <p>Loading...</p>;
