import { MergeDeep } from 'type-fest';
import { Database as DatabaseGenerated } from '@repo/supabase';

type FullReviewsViewGenerated =
  DatabaseGenerated['public']['Views']['full_reviews']['Row'];
type ReviewsGenerated = DatabaseGenerated['public']['Tables']['reviews']['Row'];

// Since the view is generated using a left join on the table, we can assume that the fields in the view share the same type & nullability as the fields in the table
type FullReviews = MergeDeep<FullReviewsViewGenerated, ReviewsGenerated>;

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Views: {
        full_reviews: {
          Row: FullReviews;
        };
      };
    };
  }
>;
