import { NextPage } from 'next';
import { CurrentPropertyResults, PreviousPropertyResults } from './PropertyResults';

const OwnedPropertiesPage: NextPage = () => (
  <div className='flex flex-col gap-4'>
    <div className='flex flex-col gap-2'>
      <h2 className='text-lg font-semibold'>Your Current Properties</h2>
      <div className='w-full overflow-x-scroll pb-2'>
        <div className='flex flex-row w-fit px-4 py-2 gap-4'>
          <CurrentPropertyResults />
        </div>
      </div>
    </div>

    <div className='flex flex-col gap-2'>
      <h2 className='text-lg font-semibold'>Your Previous Properties</h2>
      <div className='w-full overflow-x-scroll pb-2'>
        <div className='flex flex-row w-fit px-4 py-2 gap-4'>
          <PreviousPropertyResults />
        </div>
      </div>
    </div>
  </div>
);

export default OwnedPropertiesPage;
