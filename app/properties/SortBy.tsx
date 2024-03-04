/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React from 'react';

const defaultSortBy = 'rating';
const defaultSortOrder = 'desc';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const SortBy: React.FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setSortBy = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === defaultSortBy) {
      params.delete('sortBy');
    } else params.set('sortBy', value);

    replace(`${pathname}?${params.toString()}`);
  };

  const setSortOrder = (value: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams);

    if (value === defaultSortOrder) {
      params.delete('sortOrder');
    } else params.set('sortOrder', value);

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className='flex flex-col gap-2'>
      <p>Sort By</p>
      <div className='flex flex-col px-2 py-4 border-y border-foreground/30 gap-2'>
        {['rating', 'recent', 'address'].map((sortBy) => {
          const selected = searchParams.get('sortBy') === sortBy || (!searchParams.get('sortBy') && sortBy === defaultSortBy);

          return (
            <div
              key={sortBy}
              className={`${selected ? 'bg-secondary/10' : ''} flex flex-1 rounded-md border flex-row min-w-[15rem] justify-between p-2`}
            >
              <button
                onClick={() => setSortBy(sortBy)}
                type='button'
                className={`px-2 py-1 ${selected ? 'cursor-default' : 'cursor-pointer'} w-full text-left`}
                disabled={selected}
              >
                {capitalize(sortBy)}
              </button>
              {selected && (
                <div className='flex flex-row gap-2'>
                  <label
                    htmlFor={`sort${sortBy}Ascending`}
                    className='contents'
                  >
                    <p className='sr-only'>Order Ascending</p>
                    <button
                      type='button'
                      id={`sort${sortBy}Ascending`}
                      onClick={() => setSortOrder('asc')}
                      className={`px-2 py-1 border rounded-md ${searchParams.get('sortOrder') === 'asc' ? 'bg-accent/20' : ''}`}
                    >
                      <ArrowUpIcon className='w-5 h-5' />
                    </button>
                  </label>

                  <label
                    htmlFor={`sort${sortBy}Descending`}
                    className='contents'
                  >
                    <p className='sr-only'>Order Descending</p>
                    <button
                      type='button'
                      id={`sort${sortBy}Descending`}
                      onClick={() => setSortOrder('desc')}
                      className={`px-2 py-1 border rounded-md ${searchParams.get('sortOrder') === null ? 'bg-accent/20' : ''}`}
                    >
                      <ArrowDownIcon className='w-5 h-5' />
                    </button>
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SortBy;
