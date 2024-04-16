import React, { Suspense } from 'react';
import { NextPage } from 'next';
import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { Button, Divider } from '@/components/ClientTremor';
import Link from 'next/link';
import StarRatingLayout from '@/components/StarRating';
import RatingGraph from './RatingGraph';

const getAverageRatingOverTime = async (landlordId: string) => {
  const supabase = createServerSupabaseClient();

  const { data } = await supabase
    .rpc('reviews_for_landlord', { id: landlordId })
    .select('landlord_rating, review_posted ')
    .order('review_posted', { ascending: true });

  if (!data || data.length === 0) return null;

  const firstDate = new Date(data[0]!.review_posted);

  // calculate the date difference between the first review and today
  const dateDifference = Math.abs(new Date().getTime() - firstDate.getTime());
  const daysDifference = Math.ceil(dateDifference / (1000 * 3600 * 24));

  let intervals: {
    start: number;
    end: number;
    label: string;
    longLabel: string;
  }[] = [];

  // intervals are daily, weekly, montlly, 6 months, and yearly
  // use the smallest interval that takes less thn 20 intervals
  // format the date based on the interval

  if (daysDifference < 20) {
    intervals = Array.from({ length: daysDifference }, (_, i) => {
      const date = new Date(firstDate.getTime() + i * 1000 * 3600 * 24);
      return {
        start: i * 1000 * 3600 * 24,
        end: (i + 1) * 1000 * 3600 * 24,
        label: date.toLocaleDateString(),
        longLabel: date.toLocaleDateString(),
      };
    });
  } else if (daysDifference < 20 * 7) {
    intervals = Array.from(
      { length: Math.ceil(daysDifference / 7) },
      (_, i) => {
        const startDate = new Date(
          firstDate.getTime() + i * 7 * 1000 * 3600 * 24,
        );
        const endDate = new Date(
          firstDate.getTime() + (i + 1) * 7 * 1000 * 3600 * 24,
        );
        return {
          start: i * 7 * 1000 * 3600 * 24,
          end: (i + 1) * 7 * 1000 * 3600 * 24,
          label: `${endDate.getDate()} ${endDate.toLocaleDateString('default', { month: 'short' })} ${startDate.getFullYear()}`,
          longLabel: `${startDate.getDate()} ${startDate.toLocaleDateString('default', { month: 'short' })} ${startDate.getFullYear()} - ${endDate.getDate()} ${endDate.toLocaleDateString('default', { month: 'short' })} ${endDate.getFullYear()}`,
        };
      },
    );
  } else if (daysDifference < 20 * 30) {
    intervals = Array.from(
      { length: Math.ceil(daysDifference / 30) },
      (_, i) => {
        const date = new Date(firstDate.getTime() + i * 30 * 1000 * 3600 * 24);
        return {
          start: i * 30 * 1000 * 3600 * 24,
          end: (i + 1) * 30 * 1000 * 3600 * 24,
          label: date.toLocaleDateString('default', {
            month: 'long',
            year: 'numeric',
          }),
          longLabel: date.toLocaleDateString('default', {
            month: 'long',
            year: 'numeric',
          }),
        };
      },
    );
  } else if (daysDifference < 20 * 30 * 6) {
    intervals = Array.from(
      { length: Math.ceil(daysDifference / (30 * 6)) },
      (_, i) => {
        const startDate = new Date(
          firstDate.getTime() + i * 30 * 6 * 1000 * 3600 * 24,
        );
        const endDate = new Date(
          firstDate.getTime() + (i + 1) * 30 * 6 * 1000 * 3600 * 24,
        );

        return {
          start: i * 30 * 6 * 1000 * 3600 * 24,
          end: (i + 1) * 30 * 6 * 1000 * 3600 * 24,
          label: `${endDate.toLocaleDateString('default', { month: 'short' })} ${endDate.getFullYear()}`,
          longLabel: `${startDate.toLocaleDateString('default', { month: 'short' })} ${startDate.getFullYear()} - ${endDate.toLocaleDateString('default', { month: 'short' })} ${endDate.getFullYear()}`,
        };
      },
    );
  } else {
    intervals = Array.from(
      { length: Math.ceil(daysDifference / 365) },
      (_, i) => {
        const date = new Date(firstDate.getTime() + i * 365 * 1000 * 3600 * 24);
        return {
          start: i * 365 * 1000 * 3600 * 24,
          end: (i + 1) * 365 * 1000 * 3600 * 24,
          label: date.getFullYear().toString(),
          longLabel: date.getFullYear().toString(),
        };
      },
    );
  }

  // group reviews by interval
  const groupedData: {
    date: string;
    longLabel: string;
    reviews: {
      landlord_rating: number;
    }[];
  }[] = intervals.map((interval) => {
    const reviews = data.filter((review) => {
      const reviewDate = new Date(review.review_posted).getTime();
      return (
        reviewDate >= firstDate.getTime() + interval.start &&
        reviewDate < firstDate.getTime() + interval.end
      );
    });

    return {
      date: interval.label,
      longLabel: interval.longLabel,
      reviews,
    };
  });

  // calculate cumulative average rating for each interval
  const averageRatings: {
    date: string;
    longLabel: string;
    rating: number;
    newReviews: number;
  }[] = [];

  groupedData.reduce(
    (acc, group) => {
      const cumulativeRating =
        acc.cumulativeRating +
        group.reviews.reduce(
          (cumulative, review) => cumulative + review.landlord_rating,
          0,
        );
      const count = acc.count + group.reviews.length;

      const averageRating = cumulativeRating / count;

      averageRatings.push({
        date: group.date,
        longLabel: group.longLabel,
        rating: averageRating,
        newReviews: group.reviews.length,
      });

      return {
        cumulativeRating,
        count,
      };
    },
    { cumulativeRating: 0, count: 0 },
  );

  if (averageRatings.length < 2) return null;

  return averageRatings;
};

const AverageRatingGraph: React.FC<{ landlordId: string }> = async ({
  landlordId,
}) => {
  const ratings = await getAverageRatingOverTime(landlordId);

  if (!ratings) return null;

  return <RatingGraph ratings={ratings} />;
};

const getAverageRating = async (landlordId: string) => {
  const supabase = createServerSupabaseClient();

  const { data } = await supabase
    .rpc('landlord_public_profiles_with_ratings')
    .eq('user_id', landlordId)
    .select('average_rating, user_id')
    .single();

  return data?.average_rating;
};

const AverageRatingStars: React.FC<{ landlordId: string }> = async ({
  landlordId,
}: {
  landlordId: string;
}) => {
  const averageRating = await getAverageRating(landlordId);

  // Show error message if no rating
  if (!averageRating) return <p>No rating available</p>;

  return <StarRatingLayout rating={averageRating} />;
};

const LandlordDashboard: NextPage = async () => {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // unauthenticated users should be handled by middleware
  // return null to assert types
  if (!user) return null;

  await getAverageRatingOverTime(user.id);

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col items-center gap-1'>
        <Link className='contents' href={`/profiles/${user.id}`}>
          <Button>View Your Public Profile</Button>
        </Link>
        <Divider />
        <h3 className='text-accent text-2xl font-bold'>Your Rating</h3>
        <Suspense fallback={<p>Loading...</p>}>
          <AverageRatingStars landlordId={user.id} />
          <AverageRatingGraph landlordId={user.id} />
        </Suspense>
      </div>
    </div>
  );
};

export default LandlordDashboard;
