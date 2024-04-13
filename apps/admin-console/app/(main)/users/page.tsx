import AdminConsolePageLayout from '@/components/ui/page-layout';
import { NextPage } from 'next';

const UsersPage: NextPage = () => (
  <AdminConsolePageLayout title='Users'>
    <div className='flex flex-col items-center gap-2'>
      <p className='text-md font-semibold'>Nothing Here Yet</p>
      <div>
        <p>Should Contain:</p>
        <ul className='list-disc pl-6'>
          <li>List of users</li>
          <li>User details/status</li>
          <li>Actions to take on users (e.g. ban)</li>
        </ul>
      </div>
    </div>
  </AdminConsolePageLayout>
);

export default UsersPage;
