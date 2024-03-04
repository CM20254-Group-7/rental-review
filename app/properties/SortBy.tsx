'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

const SortBy: React.FC = () => {
  const searchParams = useSearchParams();

  return (
    <div className='flex flex-col gap-2'>
      <p>Sort By</p>
      <div className='flex flex-col px-2 py-4 border-y border-foreground/30 gap-2'>
        {/* <button className='flex flex-row items-center gap-2'>
          <span>Price</span>
          <ChevronDownIcon className='h-5 w-5' />
        </button>
        <button className='flex flex-row items-center gap-2'>
          <span>Rating</span>
          <ChevronRightIcon className='h-5 w-5' />
        </button> */}
      </div>
    </div>
  );
};

export default SortBy;
