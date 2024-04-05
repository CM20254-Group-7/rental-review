import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import Link from 'next/link';
import { FC, cache } from 'react';

const getCurrentProperties = cache(async () => {
  const supabase = createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: currentProperties } = await supabase
    .from('property_ownership')
    .select('id:property_id, started_at, ended_at')
    .eq('landlord_id', user.id)
    .is('ended_at', null);

  if (!currentProperties) return [];

  const { data: propertyDetails } = await supabase
    .rpc('properties_full')
    .in('id', currentProperties.map(({ id }) => id))
    .select('id, address, average_rating');

  if (!propertyDetails) return [];

  return currentProperties.flatMap((property) => {
    const details = propertyDetails.find(({ id }) => id === property.id);
    if (!details) return [];
    return { ...property, ...details };
  });
});

const getPreviousProperties = cache(async () => {
  const supabase = createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: previousProperties } = await supabase
    .from('property_ownership')
    .select('id:property_id, started_at, ended_at')
    .eq('landlord_id', user.id)
    .not('ended_at', 'is', null);

  if (!previousProperties) return [];

  const { data: propertyDetails } = await supabase
    .rpc('properties_full')
    .in('id', previousProperties.map(({ id }) => id))
    .select('id, address, average_rating');

  if (!propertyDetails) return [];

  return previousProperties.flatMap((property) => {
    const details = propertyDetails.find(({ id }) => id === property.id);
    if (!details) return [];
    return { ...property, ...details };
  });
});

const PropertyResult: FC<{
  id: string;
  address: string;
  averageRating: number;
  ownershipStartedAt: string;
  ownershipEndedAt: string | null;
}> = ({
  id,
  address,
  averageRating,
  ownershipStartedAt,
  ownershipEndedAt,
}) => {
  const startDate = new Date(ownershipStartedAt).toLocaleDateString();
  const endDate = ownershipEndedAt && new Date(ownershipEndedAt).toLocaleDateString();

  return (
    <Link
      href={`/properties/${id}`}
      className='flex flex-col gap-1 border border-foreground/30 rounded-md w-60 bg-foreground/20 hover:bg-foreground/30 transition-all hover:shadow-sm hover:shadow-foreground/30'
    >
      <h2>{address}</h2>
      <p>
        Average Rating:
        {averageRating}
      </p>
      <p>
        {
          ownershipEndedAt
            ? `Owned: ${startDate} - ${endDate}`
            : `Owned since ${startDate}`
        }
      </p>
    </Link>
  );
};

export const CurrentPropertyResults = async () => {
  const properties = await getCurrentProperties();

  if (properties.length === 0) return <p>No current properties</p>;

  return properties.map((property) => (
    <PropertyResult
      key={property.id}
      id={property.id}
      address={property.address}
      averageRating={property.average_rating}
      ownershipStartedAt={property.started_at}
      ownershipEndedAt={property.ended_at}
    />
  ));
};

export const PreviousPropertyResults = async () => {
  const properties = await getPreviousProperties();

  if (properties.length === 0) return <p>No previous properties</p>;

  return properties.map((property) => (
    <PropertyResult
      key={property.id}
      id={property.id}
      address={property.address}
      averageRating={property.average_rating}
      ownershipStartedAt={property.started_at}
      ownershipEndedAt={property.ended_at}
    />
  ));
};
