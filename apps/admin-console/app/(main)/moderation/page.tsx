import AdminConsolePageLayout from '@/components/ui/page-layout';
import { createServiceSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

const getAllReports = async () => {
  cookies(); // not entirely sure why, but the data fetch fails if this function is not called first

  const supabase = createServiceSupabaseClient();
  const { data } = await supabase.from('review_reports').select('*');

  return data ?? [];
};

const ReviewReportsTable: React.FC = async () => {
  const reports = await getAllReports();

  return (
    <table className='w-full'>
      <thead>
        <tr>
          <th>Report ID</th>
          {/* <th>Reported User</th> */}
          {/* <th>Reporter</th> */}
          <th>Reason</th>
          {/* <th>Reported At</th> */}
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.id}>
            <td>{report.id}</td>
            {/* <td>{report}</td> */}
            {/* <td>{report.reporter_id}</td> */}
            <td>{report.reason}</td>
            {/* <td>{report.reported_at}</td> */}
          </tr>
        ))}
      </tbody>
    </table>
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
