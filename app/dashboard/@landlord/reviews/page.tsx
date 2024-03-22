import createClient from '@/utils/supabase/server';
import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { FC, cache } from 'react';
import StarRatingLayout from '@/components/StarRating';
import { Divider } from '@tremor/react';
import { BackButton, ForwardButton } from './Pagination';
import RatingList from './RatingList';

const pageSize = 5;

const getTotalPages = cache(async (): Promise<number> => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return 0;

  const { count, error } = await supabase
    .rpc(
      'reviews_for_landlord',
      {
        id: user.id,
      },
      {
        count: 'exact',
        head: false,
      },
    );

  if (error || !count) return 0;

  return Math.ceil(count / pageSize);
});

const getReviewPage = cache(async (page: number, size: number) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: reviews } = await supabase
    .rpc('reviews_for_landlord', { id: user.id })
    .order('review_posted', { ascending: false })
    .range((page - 1) * size, page * size - 1);

  if (!reviews) return [];

  // get the address for each property
  const extendedReviews = (await Promise.all(reviews?.map(async (review) => {
    const { data: property } = await supabase.rpc('plain_text_address', { property_id: review.property_id });

    if (!property) return [];

    return {
      ...review,
      review_date: new Date(review.review_posted).toLocaleDateString(),
      review_posted: new Date(review.review_posted).toLocaleDateString(),
      address: property,
    };
  }))).flat();

  return extendedReviews;
});

const ReviewResults: FC<{
  currentPage: number;
  perPage: number;
}> = async ({ currentPage, perPage }) => {
  const reviews = await getReviewPage(currentPage, perPage);

  return (
    <div className='flex w-fit flex-row gap-2 h-fit'>
      {reviews.map((review) => (
        <div
          key={review.review_id}
          className='flex flex-1 flex-col w-[25rem] border gap-2 bg-primary/30 px-8 py-8 rounded-md mb-4'
        >
          <h1 className='text-xl text-accent font-bold'>{review.address}</h1>
          <div className='flex flex-col sm:flex-row justify-around place-items-center'>
            <div className='flex flex-col'>
              <p className='text-lg font-semibold'>Property:</p>
              <StarRatingLayout rating={review.property_rating} />
            </div>

            <div className='flex flex-col'>
              <p className='text-lg font-semibold'>Landlord:</p>
              <StarRatingLayout rating={review.landlord_rating} />
            </div>
          </div>

          <p className='text-lg font-semibold'>Review:</p>
          <p className='border flex-1 rounded-md h-fit min-h-[5rem] bg-gray-100/10 py-1 px-2'>
            {review.review_body}
          </p>
          <p className='ml-auto mt-auto text-gray-300'>{review.review_posted}</p>
        </div>
      ))}
    </div>
  );
};

const LandlordReviewsDashboardPage: NextPage<{
  searchParams?: {
    landlordReviewsPage: string;
  }
}> = async ({ searchParams }) => {
  const currentPage = Number(searchParams?.landlordReviewsPage) || 1;

  const totalPages = await getTotalPages();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // unauthenticated users should be handled by middleware
  // return null to assert types
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: reviewData } = await supabase
    .rpc('reviews_for_landlord', { id: user.id })
    .select('landlord_rating');

  if (!reviewData) return <p>No reviews yet</p>;

  const ratingCounts = reviewData.reduce((acc: number[], review) => {
    const rating = review.landlord_rating;
    if (!acc[rating]) acc[rating] = 0;
    acc[rating] += 1;
    return acc;
  }, []);

  const ratingData = [1, 2, 3, 4, 5].map((stars) => ({
    stars,
    count: ratingCounts[stars] || 0,
  })).sort((a, b) => b.stars - a.stars);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <div>
          <h2 className='text-lg font-semibold'>Your Ratings</h2>
          <RatingList data={ratingData} />
        </div>
        <Divider />
        <h2 className='text-lg font-semibold'>Your Recent Reviews</h2>
        <div className='w-full overflow-x-scroll pb-2 shadow-inner'>
          <div className='flex flex-row w-fit px-4 py-2 gap-4'>
            <BackButton />
            <ReviewResults currentPage={currentPage} perPage={pageSize} />
            <ForwardButton totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordReviewsDashboardPage;
