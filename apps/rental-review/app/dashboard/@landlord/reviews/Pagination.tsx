'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';

export const BackButton: FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get('landlordReviewsPage')) || 1;

  const prevPage = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (currentPage === 1) {
      return;
    }

    if (currentPage === 2) {
      newSearchParams.delete('landlordReviewsPage');
    } else {
      newSearchParams.set('landlordReviewsPage', String(currentPage - 1));
    }

    replace(`${pathname}?${newSearchParams.toString()}`);
  };

  if (currentPage <= 1) return null;

  return (
    <button type='button' onClick={prevPage}>
      Prev
    </button>
  );
};

export const ForwardButton: FC<{
  totalPages: number;
}> = ({ totalPages }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get('landlordReviewsPage')) || 1;

  const nextPage = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('landlordReviewsPage', String(currentPage + 1));

    replace(`${pathname}?${newSearchParams.toString()}`);
  };

  if (currentPage >= totalPages) return null;

  return (
    <button type='button' onClick={nextPage}>
      Next
    </button>
  );
};
