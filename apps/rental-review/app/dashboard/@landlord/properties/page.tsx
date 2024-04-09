import { NextPage } from 'next';
import Link from 'next/link';
import {
  CurrentPropertyResults,
  PreviousPropertyResults,
} from './PropertyResults';

const OwnedPropertiesPage: NextPage = () => (
  <div className='flex flex-col gap-4'>
    <div className='flex flex-col gap-2'>
      <h2 className='text-lg font-semibold'>Your Current Properties</h2>
      <div className='w-full overflow-x-scroll pb-2'>
        <div className='flex w-fit flex-row gap-4 px-4 py-2'>
          <CurrentPropertyResults />
        </div>
      </div>
    </div>

    <div className='flex flex-col gap-2'>
      <h2 className='text-lg font-semibold'>Your Previous Properties</h2>
      <div className='w-full overflow-x-scroll pb-2'>
        <div className='flex w-fit flex-row gap-4 px-4 py-2'>
          <PreviousPropertyResults />
        </div>
      </div>
    </div>

    <div className='flex flex-col items-center gap-2'>
      <h2 className='text-lg font-semibold'>Anything we&apos;re missing?</h2>
      <Link
        href='/properties'
        className='bg-accent hover:bg-accent/90 shadow-accent mb-6 w-fit rounded-md px-4 py-2 font-bold transition-all hover:shadow-md'
      >
        Find more in our Property Catalogue
      </Link>
    </div>
  </div>
);

export default OwnedPropertiesPage;
