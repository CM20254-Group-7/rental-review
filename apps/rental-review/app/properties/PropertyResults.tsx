import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import Link from 'next/link';
import React, { cache } from 'react';
import StarRatingLayout from '@/components/StarRating';
import CurrentOwnerIndicator from '@/components/CurrentOwnerIndicator';
import { getFeatureFlagValues, getFlagValue } from '@repo/feature-flags';
import Image from 'next/image';
import { get } from 'http';
import ResultsTable, { ResultsTableSkeleton } from './results-table';
import Pagination from './pagination';

// show all properties if pagination is disabled, otherwise show an appropriate number for the format (more for condensed)
export const getPerPage = (): Promise<'all' | number> =>
  getFeatureFlagValues().then(
    ({ propertySearchCondensedView, propertySearchPagination }) => {
      if (!propertySearchPagination) {
        return 'all';
      }
      if (propertySearchCondensedView) {
        return 10;
      }
      return 5;
    },
  );

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
    page?: string;
  }): Promise<{ properties: PropertyResults; count: number }> => {
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
      .select('id, address, average_rating, description, beds, baths, tags', {
        count: 'exact',
      });

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

    const perPage = await getPerPage();

    if (perPage !== 'all') {
      const page = searchQuery?.page ? parseInt(searchQuery.page, 10) : 1;
      const startIndex = (page - 1) * perPage;
      const endIndex = page * perPage - 1;

      baseQuery = baseQuery.range(startIndex, endIndex);
    }

    const { data: properties, error: propertiesError, count } = await baseQuery;

    if (propertiesError) {
      return { properties: [], count: 0 };
    }

    return { properties, count: count ?? 0 };
  },
);

const getPictureUrls = async (propertyId: string) => {
  const supabase = createServerSupabaseClient();

  const { data: reviews, error: reviewError } = await supabase
    .from('reviews')
    .select('review_id')
    .eq('property_id', propertyId);

  if (reviewError || !reviews) {
    return null;
  }

  const { data: pictures, error: picturesError } = await supabase
    .from('review_photos')
    .select('photo')
    .in(
      'review_id',
      reviews.map((review) => review.review_id),
    );

  if (picturesError) {
    return null;
  }

  if (pictures.length > 5) {
    return pictures.slice(0, 5).map((picture) => picture.photo);
  }

  return pictures.map((picture) => picture.photo);
};

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
  const images = await Promise.all(
    properties.map(async (property) => {
      const pictureUrls = await getPictureUrls(property.id!);
      return pictureUrls;
    }),
  );

  return properties.map((property, index) => (
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

      {/* Show the images if there are */}
      {images && images[index] && (
        <div className='flex flex-wrap gap-2'>
          {images[index]?.map((image) => (
            <Image
              key={image}
              src={image}
              alt='Property Image'
              className='h-30 w-30 flex-shrink-0 cursor-pointer rounded-md object-cover md:h-28 md:w-28'
              width={300}
              height={200}
            />
          ))}
        </div>
      )}

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

const PropertyResultsTable: React.FC<{ properties: PropertyResults }> = async ({
  properties,
}) => {
  const supabase = createServerSupabaseClient();
  const propertyDetails = await Promise.all(
    properties.map(async (property) => {
      const { data } = await supabase
        .from('property_ownership')
        .select('landlord_id')
        .eq('property_id', property.id!)
        .is('ended_at', null)
        .maybeSingle();

      const currentOwner = data?.landlord_id;

      const currentLandlordRating = currentOwner
        ? (
            await supabase.rpc('average_landlord_rating', {
              id: currentOwner,
            })
          ).data
        : null;

      return {
        id: property.id!,
        address: property.address!,
        average_rating: property.average_rating!,
        current_landlord_rating: currentLandlordRating,
      };
    }),
  );
  return <ResultsTable properties={propertyDetails} />;
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
    page?: string;
  };
}> = async ({ searchParams }) => {
  const { properties, count } = await getPropertyResults({
    ...searchParams,
    tags: searchParams?.tags ? [searchParams.tags].flat() : undefined,
  });

  const condensedResultFormat = (await getFlagValue(
    'propertySearchCondensedView',
  )) as boolean;

  const perPage = await getPerPage();
  const paginate = perPage !== 'all';

  return (
    <>
      {condensedResultFormat ? (
        <PropertyResultsTable properties={properties} />
      ) : (
        <PropertyResultsCards properties={properties} />
      )}
      {paginate && <Pagination pageSize={perPage} totalResults={count} />}
    </>
  );
};

export default PropertyResults;

const ResultsCardsSkeleton: React.FC = async () => (
  <div className='my-auto'>Properties Loading...</div>
);

// TODO: Replace with skeleton
export const PropertyResultsSkeleton: React.FC = async () =>
  getFlagValue('propertySearchCondensedView').then((condensedResultFormat) =>
    (condensedResultFormat as boolean) ? (
      <ResultsTableSkeleton rows={10} />
    ) : (
      <ResultsCardsSkeleton />
    ),
  );
