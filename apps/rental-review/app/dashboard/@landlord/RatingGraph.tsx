'use client';

import { AreaChart, CustomTooltipProps } from '@/components/ClientTremor';
import React from 'react';

const customTooltip: React.FC<CustomTooltipProps> = ({ payload, active }) => {
  if (!active || !payload) return null;
  return (
    <div className='rounded-tremor-default border-tremor-border bg-tremor-background text-tremor-default shadow-tremor-dropdown w-56 border p-2'>
      {payload.map((category) => (
        <div key={category.payload.date} className='flex flex-1 space-x-2.5'>
          <div
            className={`flex w-1 flex-col bg-${category.color}-500 rounded`}
          />
          <div className='space-y-1'>
            <p className='text-tremor-content'>{category.payload.longLabel}</p>
            <p className='text-tremor-content-emphasis font-medium'>
              {category.dataKey}:{category.payload.rating}
            </p>
            <p className='text-tremor-content-emphasis'>
              New Reviews: {category.payload.newReviews}
            </p>
          </div>
        </div>
      ))}
      {/* <pre className='text-red-500'>{JSON.stringify({ payload, active }, null, '\t')}</pre> */}
    </div>
  );
};

const RatingGraph: React.FC<{
  ratings: {
    date: string;
    rating: number;
    newReviews: number;
  }[];
}> = ({ ratings }) => (
  <AreaChart
    className='mt-4 h-72'
    data={ratings}
    index='date'
    categories={['rating']}
    colors={['accent']}
    yAxisWidth={30}
    intervalType='preserveStartEnd'
    minValue={0}
    maxValue={5}
    connectNulls
    customTooltip={customTooltip}
  />
);

export default RatingGraph;
