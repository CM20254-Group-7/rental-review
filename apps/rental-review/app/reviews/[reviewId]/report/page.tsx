import { NextPage } from 'next';
import {
  Button,
  Divider,
  Select,
  SelectItem,
  TextInput,
  Textarea,
} from '@tremor/react';
import { ReviewDetailsLayout } from '@/components/ReviewDetails';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@repo/supabase-client-helpers/server-only';
import { Tooltip } from '@nextui-org/tooltip';
import { z } from 'zod';
import BackButton from './_components/back-button';
import FormWrapper, { ReportReviewState } from './_components/form-wrapper';
import FormSubmitButton from './_components/form-submit-button';

const reportReviewSchema = z.object({
  reason: z.string(),
  explanation: z.string(),
  contact: z.string(),
});

const reportReview = async (
  reviewId: string,
  reason: string,
  explanation: string,
  contact: string,
): Promise<ReportReviewState> => {
  // Verify the user is logged in
  const serverSupabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();
  if (!user) {
    return {
      message: 'You must be logged in to report a review',
    };
  }

  // Verify review exists
  const { data: reviewDetails } = await serverSupabase
    .from('reviews')
    .select('property_id, reviewer_id, review_date')
    .eq('review_id', reviewId)
    .single();

  if (!reviewDetails) {
    return {
      message: 'Review not found',
    };
  }

  // verify user is not reporting their own review
  const { data: reviewerProfile } = await serverSupabase
    .from('reviewer_private_profiles')
    .select('user_id')
    .eq('property_id', reviewDetails.property_id)
    .eq('reviewer_id', reviewDetails.reviewer_id)
    .maybeSingle();

  if (reviewerProfile?.user_id === user.id) {
    return {
      message: 'You cannot report your own review',
    };
  }

  // check whether the reason is
  // - valid
  // - available to the user
  const { data: reportReason } = await serverSupabase
    .from('report_reasons')
    .select('*')
    .eq('reason', reason)
    .single();

  if (!reportReason) {
    return {
      message: 'Invalid report reason',
    };
  }

  if (reportReason.owner_only) {
    const { data: landlordForReview } = await serverSupabase.rpc(
      'property_owner_on_date',
      {
        property_id: reviewDetails.property_id,
        query_date: reviewDetails.review_date,
      },
    );

    if (landlordForReview !== user.id) {
      return {
        message:
          'You cannot report this review for this reason as the review is not about you',
      };
    }
  }

  // Create the report
  const serviceSupabase = createServiceSupabaseClient();
  const { error } = await serviceSupabase.from('review_reports').insert([
    {
      review_id: reviewId,
      reporter_id: user.id,
      reason,
      explanation,
      contact_email: contact,
    },
  ]);

  if (error) {
    return {
      message: 'An error occurred while reporting the review',
    };
  }

  return { message: 'Review reported' };
};

const ReportReviewPage: NextPage<{
  params: {
    reviewId: string;
  };
}> = async ({ params: { reviewId } }) => {
  const supabase = createServerSupabaseClient();

  const { data: reviewDetails } = await supabase
    .from('reviews')
    .select('*, review_tags(tag)')
    .eq('review_id', reviewId)
    .single()
    .then(({ data, error }) => ({
      data: data
        ? {
            ...data,
            review_tags: data.review_tags.map(({ tag }) => tag),
          }
        : null,
      error,
    }));

  if (!reviewDetails) notFound();

  // User must be logged in to report a review
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <main className='flex flex-col items-center gap-6 py-16'>
        <h1 className='text-lg font-semibold'>
          You must be logged in to report a review
        </h1>
        <p>
          This restriction helps us avoid spam and prevent abuse of the system
        </p>
        <Link href={`/login?redirect=/reviews/${reviewId}/report`}>
          <Button variant='primary'>Go to login</Button>
        </Link>
      </main>
    );
  }

  // User cannot report their own review
  const { data: reviewerProfile } = await supabase
    .from('reviewer_private_profiles')
    .select('user_id')
    .eq('property_id', reviewDetails.property_id)
    .eq('reviewer_id', reviewDetails.reviewer_id)
    .maybeSingle();

  if (reviewerProfile?.user_id === user.id) {
    return (
      <main className='flex flex-col items-center gap-6 py-16'>
        <h1 className='text-lg font-semibold'>
          You cannot report your own review
        </h1>
        <p>
          Please edit or delete your review if you would like to make changes
        </p>
        <Link href={`/reviews/${reviewId}/manage`}>
          <Button variant='primary'>Manage review</Button>
        </Link>
      </main>
    );
  }

  const { data: reportReasons } = await supabase
    .from('report_reasons')
    .select('*');

  const { data: landlordForReview } = await supabase.rpc(
    'property_owner_on_date',
    {
      property_id: reviewDetails.property_id,
      query_date: reviewDetails.review_date,
    },
  );

  const reviewIsForCurrentUser = landlordForReview === user.id;
  const availableReasons =
    (reviewIsForCurrentUser
      ? reportReasons
      : reportReasons?.filter((reason) => !reason.owner_only)) ?? [];
  const unavailableReasons =
    (reviewIsForCurrentUser
      ? []
      : reportReasons?.filter((reason) => reason.owner_only)) ?? [];

  const submitAction = async (
    prevState: ReportReviewState,
    formData: FormData,
  ): Promise<ReportReviewState> => {
    'use server';

    // Validate form data
    const validatedFields = reportReviewSchema.safeParse({
      reason: formData.get('reason'),
      explanation: formData.get('explanation'),
      contact: formData.get('contact'),
    });
    if (!validatedFields.success) {
      return {
        message: 'Please fill out all fields',
      };
    }
    const { reason, explanation, contact } = validatedFields.data;

    return reportReview(reviewId, reason, explanation, contact);
  };

  return (
    <main className='flex w-full max-w-prose flex-col items-center gap-4 p-4 py-10'>
      <div className='flex w-full flex-row items-start'>
        <BackButton />
      </div>
      <h1 className='-mb-4 text-xl font-semibold'>Report Review</h1>
      <Divider />
      <ReviewDetailsLayout
        reviewId={reviewId}
        propertyId={reviewDetails.property_id}
        reviewDate={reviewDetails.review_date}
        reviewMessage={reviewDetails.review_body}
        reviewTags={reviewDetails.review_tags}
        propertyRating={reviewDetails.property_rating}
        landlordRating={reviewDetails.landlord_rating}
        aboutActiveLandlord={reviewIsForCurrentUser}
        showReportButton={false}
      />
      <Divider />
      <FormWrapper
        className='flex w-full max-w-prose flex-col gap-4'
        action={submitAction}
      >
        <div className='flex w-fit flex-col gap-2'>
          <h2 className='text-lg font-semibold'>Reason</h2>
          <Select required className=' max-w-[16rem]' name='reason'>
            {availableReasons?.map((reason) => (
              <SelectItem key={reason.reason} value={reason.reason}>
                {reason.reason}
              </SelectItem>
            ))}
            {unavailableReasons?.map((reason) => (
              <SelectItem
                className='pointer-events-none relative opacity-50'
                key={reason.reason}
                value={reason.reason}
                aria-disabled
              >
                {reason.reason}
              </SelectItem>
            ))}
          </Select>
          {unavailableReasons.length > 0 && (
            <Tooltip
              content='Some reporting options are only available to the owner of the property on the review date.'
              placement='bottom'
              delay={200}
              classNames={{
                content:
                  'bg-background text-foreground/90 border rounded-md max-w-sm p-2 whitespace-pre-wrap',
              }}
            >
              <Button
                variant='light'
                className='text-foreground/60 hover:text-foreground/80 w-fit cursor-pointer opacity-100'
                disabled
              >
                Why can&apos;t I select some options?
              </Button>
            </Tooltip>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <h2 className='text-lg font-semibold'>Explanation</h2>
          <p className='text-foreground/80 text-sm'>
            Provide any additional context here to help our team assess your
            report.
          </p>
          <Textarea
            className='min-h-[6lh] w-full max-w-prose'
            placeholder='Details...'
            required
            name='explanation'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <h2 className='text-lg font-semibold'>
            Contact{' '}
            <span className='inline text-sm font-normal italic '>
              (optional)
            </span>
          </h2>
          <p className='text-foreground/80 text-sm'>
            If you would like to be contacted about your report, please provide
            your email address.
          </p>
          <div className='flex flex-col'>
            <p className='text-foreground/80 text-sm'>
              By leaving your email address you consent to be contacted by our
              team to:
            </p>
            <ul className='text-foreground/80 list-inside list-disc px-2 text-sm'>
              <li>Get further information if required</li>
              <li>Let you know about the outcome of your report</li>
            </ul>
          </div>
          <TextInput
            type='email'
            className='w-full max-w-[16rem]'
            placeholder='Email...'
            name='contact'
            defaultValue={user.email}
          />
        </div>
        <FormSubmitButton variant='primary' className='w-fit'>
          Submit report
        </FormSubmitButton>
      </FormWrapper>
    </main>
  );
};

export default ReportReviewPage;
