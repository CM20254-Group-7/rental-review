import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import Link from 'next/link';
import React, { cache } from 'react';
import StarRatingLayout from '@/components/StarRating';
import CurrentOwnerIndicator from '@/components/CurrentOwnerIndicator';
import { getFlagValue } from '@repo/feature-flags';

const defaultSortBy = 'rating';
const defaultSortOrder = 'desc';

type PropertyResults = {
  id: string | null;
  address: string | null;
  average_rating: number | null;
  description: string | null;
  beds: number | null;
  baths: number | null;
  tags: string[] | null;
}[];

const getPropertyResults = cache(
  async (searchQuery?: {
    sortBy?: string;
    sortOrder?: string;
    address?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    tags?: string[];
  }): Promise<PropertyResults> => {
    const supabase = createServerSupabaseClient();

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

    if (sortField) {
      baseQuery = baseQuery.order(sortField, { ascending: sortAsc });
    }

    const { data: properties, error: propertiesError } = await baseQuery;

    if (propertiesError) {
      return [];
    }

    return properties;
  },
);

const PropertyResultsCards: React.FC<{
  properties: {
    id: string | null;
    address: string | null;
    average_rating: number | null;
    description: string | null;
    beds: number | null;
    baths: number | null;
    tags: string[] | null;
  }[];
}> = async ({ properties }) => {
  if (properties.length === 0) {
    return <div>No properties found</div>;
  }

  return properties.map((property) => (
    <Link
      className='bg-secondary/10 hover:bg-secondary/20 shadow-secondary/40 hover:shadow-secondary/40 flex w-full flex-col items-center gap-4 rounded-xl border p-6 pb-8 shadow-md hover:shadow-lg'
      href={`/properties/${property.id}`}
      key={property.id}
    >
      {/* Card Header */}
      <div className='flex w-full flex-col'>
        <div className='flex flex-row justify-between'>
          <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
            {property.address}
          </h2>
          <StarRatingLayout rating={property.average_rating!} />
        </div>
        <span className='border-accent w-full border border-b' />
      </div>

      <div className='grid w-full grid-cols-1 md:grid-cols-2'>
        <div className='flex flex-col items-center justify-center gap-2'>
          {property.description || property.beds || property.baths ? (
            <>
              {property.description && (
                <p className='break-words text-sm'>{property.description}</p>
              )}
              <div className='flex flex-col gap-2'>
                {property.beds && (
                  <p className='text-sm font-semibold'>
                    Bedrooms: {property.beds}
                  </p>
                )}
                {property.baths && (
                  <p className='text-sm font-semibold'>
                    Bathrooms: {property.baths}
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className='text-sm font-semibold'>No details available</p>
          )}
        </div>
        <div className='flex flex-col items-center justify-center gap-2 md:items-end'>
          <div>
            <CurrentOwnerIndicator propertyId={property.id!} />
          </div>
        </div>
      </div>
    </Link>
  ));
};

const PropertyResultsTable: React.FC<{ properties: PropertyResults }> = ({
  properties,
}) => {
  return (
    <div>
      {properties.map((property) => (
        <p>{property.address}</p>
      ))}
    </div>
  );
};

const PropertyResults: React.FC<{
  searchParams?: {
    sortBy?: string;
    sortOrder?: string;
    address?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    tags?: string | string[];
  };
}> = async ({ searchParams }) => {
  const condensedResultFormat = await getFlagValue(
    'propertySearchCondensedView',
  );
  const properties = await getPropertyResults({
    ...searchParams,
    tags: searchParams?.tags ? [searchParams.tags].flat() : undefined,
  });

  if (condensedResultFormat)
    return <PropertyResultsTable properties={properties} />;
  return <PropertyResultsCards properties={properties} />;
};

export default PropertyResults;

// TODO: Replace with skeleton
export const PropertyResultsSkeleton: React.FC = () => (
  <div className='my-auto'>Properties Loading...</div>
);
