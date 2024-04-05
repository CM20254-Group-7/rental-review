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
  street?: string
  city?: string
  postalCode?: string
  country?: string
  tags?: string[]
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
    .from('full_properties')
    .select('id, address, average_rating, description, beds, baths, tags');

  if (searchQuery?.address) {
    baseQuery = baseQuery.textSearch('address', searchQuery.address, {
      type: 'websearch',
      config: 'english',
    });
  }

  if (searchQuery?.street) {
    baseQuery = baseQuery.textSearch('address', searchQuery.street, {
      type: 'websearch',
      config: 'english',
    });
  }

  if (searchQuery?.city) {
    baseQuery = baseQuery.textSearch('address', searchQuery.city, {
      type: 'websearch',
      config: 'english',
    });
  }

  if (searchQuery?.postalCode) {
    baseQuery = baseQuery.textSearch('address', searchQuery.postalCode, {
      type: 'websearch',
      config: 'english',
    });
  }

  if (searchQuery?.country) {
    baseQuery = baseQuery.textSearch('address', searchQuery.country, {
      type: 'websearch',
      config: 'english',
    });
  }

  if (searchQuery?.tags && searchQuery.tags.length > 0) {
    baseQuery = baseQuery.contains('tags', searchQuery.tags);
  }

  if (sortField) baseQuery = baseQuery.order(sortField, { ascending: sortAsc });

  const { data: properties, error: propertiesError } = await baseQuery;

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
    street?: string
    city?: string
    postalCode?: string
    country?: string
    tags?: string | string[]
  }
}> = async ({ searchParams }) => {
  const { properties } = await getPropertyResults({
    ...searchParams,
    tags: searchParams?.tags ? [searchParams.tags].flat() : undefined,
  });

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
          <StarRatingLayout rating={property.average_rating!} />
        </div>
        <span className='border border-b w-full border-accent' />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
        <div className='flex flex-col gap-2 justify-center items-center'>
          {(property.description || property.beds || property.baths)
            ? (
              <>
                {property.description && (
                  <p className='text-sm break-words'>{property.description}</p>
                )}
                <div className='flex flex-col gap-2'>
                  {property.beds && (
                    <p className='text-sm font-semibold'>
                      Bedrooms:
                      {' '}
                      {property.beds}
                    </p>
                  )}
                  {property.baths && (
                    <p className='text-sm font-semibold'>
                      Bathrooms:
                      {' '}
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
        <div className='flex flex-col gap-2 justify-center items-center md:items-end'>
          <div>
            <CurrentOwnerIndicator propertyId={property.id!} />
          </div>
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
