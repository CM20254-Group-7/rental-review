import AdminConsolePageLayout from '@/components/ui/page-layout';
import { NextPage } from 'next';

const FeaturesPage: NextPage = () => (
  <AdminConsolePageLayout title='Features'>
    <div className='flex flex-col items-center gap-2'>
      <p className='text-md font-semibold'>Nothing Here Yet</p>
      <div>
        <p>Should Contain:</p>
        <ul className='list-disc pl-6'>
          <li>List of feature flags</li>
          <li>View/set global feature flags</li>
          <li>Option to enable vercel toolbar for public site</li>
        </ul>
      </div>
    </div>
  </AdminConsolePageLayout>
);

export default FeaturesPage;
