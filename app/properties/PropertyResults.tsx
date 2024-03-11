import CurrentOwnerIndicator from '@/components/CurrentOwnerIndicator';
import StarRatingLayout from '@/components/StarRating';
import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import React, { cache } from 'react';

const defaultSortBy = 'rating';
const defaultSortOrder = 'desc';

const getPropertyResults = cache(async (searchQuery?: {
  sortBy?: string,
  sortOrder?: string,
  address?: string
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const sortBy = searchQuery?.sortBy || defaultSortBy;
  const sortOrder = searchQuery?.sortOrder || defaultSortOrder;

  const sortField = (() => {
    switch (sortBy) {
      case 'address':
        return 'address';

      case 'recent':
        return 'last_reviewed';

      case 'rating':
        return 'average_rating';

      default:
        return null;
    }
  })();
  const sortAsc = sortOrder === 'asc';

  let baseQuery = supabase
    .rpc('properties_full');

  if (searchQuery?.address) {
    baseQuery = baseQuery.textSearch('address', searchQuery.address, {
      type: 'websearch',
      config: 'english',
    });
  }

  let query = baseQuery.select('*');

  if (sortField) query = query.order(sortField, { ascending: sortAsc });

  const { data: properties, error: propertiesError } = await query;

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
    sortBy?: string
    sortOrder?: string
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
        <div className='flex flex-row justify-between'>
          <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>{property.address}</h2>
          <StarRatingLayout rating={property.average_rating} />
        </div>
        <span className='border border-b w-full border-accent' />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
        <div className='flex flex-col gap-2 justify-center items-center'>
          {(property.description || property.beds || property.baths)
            ? (
              <>
                {property.description && (
                <p className='text-sm'>{property.description}</p>
                )}
                <div className='flex flex-col gap-2'>
                  {property.beds && (
                  <p className='text-sm font-semibold'>
                    Bedrooms:
                    {property.beds}
                  </p>
                  )}
                  {property.baths && (
                  <p className='text-sm font-semibold'>
                    Bathrooms:
                    {property.baths}
                  </p>
                  )}
                </div>
              </>
            ) : (
              <p className='text-sm font-semibold'>
                No details available
              </p>
            )}
        </div>
        <div className='flex flex-row justify-end w-full'>
          <CurrentOwnerIndicator
            propertyId={property.id}
          />
        </div>
      </div>
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
