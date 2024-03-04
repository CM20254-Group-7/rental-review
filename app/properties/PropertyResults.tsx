import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import React, { cache } from 'react';

const getPropertyResults = cache(async (searchQuery?: {
  address?: string
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const query = supabase
    .rpc('properties_full');

  if (searchQuery?.address) {
    query.textSearch('address', searchQuery.address, {
      type: 'websearch',
      config: 'english',
    });
  }

  const { data: properties, error: propertiesError } = await query.select('*');

  if (propertiesError) {
    return {
      properties: [],
    };
  }

  return {
    properties,
  };
});
const PropertyResults: React.FC<{
  searchParams?: {
    address?: string
  }
}> = async ({ searchParams }) => {
  const { properties } = await getPropertyResults(searchParams);

  if (properties.length === 0) {
    return (
      <div>
        No properties found
      </div>
    );
  }

  return properties.map((property) => (
    <Link
      className='flex flex-col w-full items-center rounded-xl bg-secondary/10 hover:bg-secondary/20 p-6 pb-8 gap-4 border shadow-md shadow-secondary/40 hover:shadow-lg hover:shadow-secondary/40'
      href={`/properties/${property.id}`}
      key={property.id}
    >
      {/* Card Header */}
      <div className='flex flex-col w-full'>
        <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>{property.address}</h2>
        <span className='border border-b w-full border-accent' />
      </div>

      {/* Property Details here */}
      {/* <div className='flex flex-col gap-2'>

      </div> */}
    </Link>
  ));
};

export default PropertyResults;

// TODO: Replace with skeleton
export const PropertyResultsSkeleton: React.FC = () => (
  <div className='my-auto'>
    Properties Loading...
  </div>
);
