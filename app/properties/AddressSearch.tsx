'use client';

import React, { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const AddressSearch: React.FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [advanced, setAdvanced] = useState(searchParams.get('showAdvancedPropertySearch') === 'true');
  const toggleAdvanced = () => {
    const params = new URLSearchParams(searchParams?.toString());

    if (advanced) {
      params.delete('showAdvancedPropertySearch');
    } else {
      params.set('showAdvancedPropertySearch', 'true');
    }
    replace(`${pathname}?${params.toString()}`);
    setAdvanced(!advanced);
  };

  const handleSearch = (searchQuery?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!searchQuery) params.delete('address');
    else params.set('address', searchQuery);

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className='flex flex-col gap-2'>
      <p>Search By Address</p>
      <div className='flex flex-col px-2 py-4 border-y border-foreground/30 gap-2'>
        <form
          className='flex flex-row border rounded-md'
          onSubmit={(e) => {
            e.preventDefault();
            const addressSearchQuery = (e.target as HTMLFormElement).querySelector('input')?.value;
            handleSearch(addressSearchQuery);
          }}
        >
          <label htmlFor='basicAddressSearch' className='contents'>
            <p className='sr-only'>Address</p>
            <input
              id='basicAddressSearch'
              type='text'
              className='flex-1 border-0 rounded-md p-2 bg-inherit focus:bg-secondary/10'
              defaultValue={searchParams.get('address') || undefined}
              placeholder='Enter address'
            />
          </label>

          <button
            type='submit'
            className='border-l border-foreground/30 px-4 text-accent hover:bg-secondary/10 dark:hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/20'
          >
            Search
          </button>
        </form>

        {/*
          TODO: Advanced search form
          search by:
          - house
          - street
          - city/county
          - postal code
          - country
          - property type
        */}

        <button
          className='flex flex-row ml-auto text-sm hover:underline items-center px-2'
          type='button'
          onClick={toggleAdvanced}
        >
          {advanced ? <ChevronDownIcon className='w-4 h-4' /> : <ChevronRightIcon className='w-4 h-4' />}
          {' '}
          Advanced
        </button>

        {advanced && (
          <div className='text-center'>
            Coming Soon
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressSearch;
