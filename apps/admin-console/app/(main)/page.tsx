import AdminConsolePageLayout from '@/components/ui/page-layout';
import { NextPage } from 'next';

const Dashboard: NextPage = () => (
  <AdminConsolePageLayout title='Dashboard'>
    <div className='flex flex-col items-center gap-2'>
      <p className='text-md font-semibold'>Nothing Here Yet</p>
      <div>
        <p>Should Contain:</p>
        <ul className='list-disc pl-6'>
          <li>Site Statistics</li>
        </ul>
      </div>
    </div>
  </AdminConsolePageLayout>
);

export default Dashboard;
