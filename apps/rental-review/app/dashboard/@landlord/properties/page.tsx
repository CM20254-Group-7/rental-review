import { NextPage } from 'next';
import Link from 'next/link';
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

    <div className='flex flex-col gap-2 items-center'>
      <h2 className='text-lg font-semibold'>Anything we&apos;re missing?</h2>
      <Link
        href='/properties'
        className='bg-accent hover:bg-accent/90 hover:shadow-md shadow-accent transition-all w-fit font-bold py-2 px-4 rounded-md mb-6'
      >
        Find more in our Property Catalogue
      </Link>
    </div>
  </div>
);

export default OwnedPropertiesPage;
