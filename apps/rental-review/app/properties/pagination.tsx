'use client';

import { FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ClientTremor';
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronDoubleRightIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';

const Pagination: FC<{ pageSize: number; totalResults: number }> = ({
  pageSize,
  totalResults,
}) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const pageNo = page ? parseInt(page, 10) : 1;

  const totalPages = Math.ceil(totalResults / pageSize);

  const setPage = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (newPage > 1) {
      newSearchParams.set('page', newPage.toString());
    } else {
      newSearchParams.delete('page');
    }

    replace(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className='flex flex-col items-center gap-2'>
      <p>
        Viewing results {pageNo * pageSize - pageSize + 1} to{' '}
        {Math.min(pageNo * pageSize, totalResults)} of {totalResults}
      </p>
      <div className='grid grid-cols-5 items-center gap-2'>
        {/* option to go to first page if page > 2 */}
        {pageNo > 2 ? (
          <Button variant='secondary' type='button' onClick={() => setPage(1)}>
            <ChevronDoubleLeftIcon className='h-4' />
            <label className='sr-only'>Go to first page</label>
          </Button>
        ) : (
          <div />
        )}
        {/* option to go to previous page if page > 1 */}
        {pageNo > 1 ? (
          <Button
            variant='secondary'
            type='button'
            onClick={() => setPage(pageNo - 1)}
          >
            <ChevronLeftIcon className='h-4' />
            <label className='sr-only'>Go to previous page</label>
          </Button>
        ) : (
          <div />
        )}
        <div />
        {/* option to go to next if page < total pages */}
        {pageNo < totalPages ? (
          <Button
            variant='secondary'
            type='button'
            onClick={() => setPage(pageNo + 1)}
          >
            <ChevronRightIcon className='h-4' />
            <label className='sr-only'>Go to next page</label>
          </Button>
        ) : (
          <div />
        )}
        {/* option to go to last page if page < total pages - 1 */}
        {pageNo < totalPages - 1 ? (
          <Button
            variant='secondary'
            type='button'
            onClick={() => setPage(totalPages)}
          >
            <ChevronDoubleRightIcon className='h-4' />
            <label className='sr-only'>Go to last page</label>
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default Pagination;
