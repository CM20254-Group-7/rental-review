import AdminConsolePageLayout from '@/components/ui/page-layout';
import { createServiceSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { columns } from './_components/columns';
import DataTable from './_components/data-table';

const getPossibleReportReasons = cache(async () => {
  cookies();

  const supabase = createServiceSupabaseClient();
  const data = await supabase
    .from('report_reasons')
    .select('reason')
    .then((res) => res.data?.map((r) => r.reason));

  return data ?? [];
});

const getAllReports = async () => {
  cookies(); // not entirely sure why, but the data fetch fails if this function is not called first

  const supabase = createServiceSupabaseClient();
  const data = await supabase
    .from('review_reports')
    .select('*')
    .then(async (res) =>
      Promise.all(
        res.data?.map(async (r) => {
          // get the review data
          const { data: review } = await supabase
            .from('full_reviews')
            .select('*')
            .eq('review_id', r.review_id)
            .single();

          // get the property data
          const { data: property } = await supabase
            .from('full_properties')
            .select('*')
            .eq('id', review!.property_id)
            .single();

          return {
            ...r,
            review: review!,
            property: property!,
          };
        }) ?? [],
      ),
    );

  return data ?? [];
};

const ReviewReportsTable: React.FC = async () => {
  const reports = await getAllReports();
  const reportReasons = await getPossibleReportReasons();

  return (
    <DataTable columns={columns} data={reports} reportReasons={reportReasons} />
  );
};

const ModerationPage: NextPage = () => (
  <AdminConsolePageLayout title='Moderation'>
    <div className='flex flex-col items-center gap-2'>
      <ReviewReportsTable />
    </div>
  </AdminConsolePageLayout>
);

export default ModerationPage;
