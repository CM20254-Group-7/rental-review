import AdminConsolePageLayout from '@/components/ui/page-layout';
import { NextPage } from 'next';

const ModerationPage: NextPage = () => (
  <AdminConsolePageLayout title='Moderation'>
    <div className='flex flex-col items-center gap-2'>
      <p className='text-md font-semibold'>Nothing Here Yet</p>
      <div>
        <p>Should Contain:</p>
        <ul className='list-disc pl-6'>
          <li>Current moderation requests</li>
          <li>Current verification requests</li>
          <li>Option to accept/reject the above</li>
        </ul>
      </div>
    </div>
  </AdminConsolePageLayout>
);

export default ModerationPage;
