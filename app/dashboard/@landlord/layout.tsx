import React, { FC } from 'react';
import Tab from './tab';

const LandlordLayout: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const tabs = [
    {
      text: 'Summary',
      slug: '',
    },
    {
      text: 'Properties',
      slug: 'properties',
    },
    {
      text: 'Reviews',
      slug: 'reviews',
    },
  ];

  return (
    <div className='flex w-screen max-w-prose flex-col gap-2 bg-accent/20 rounded-md'>
      <div className='flex flex-row justify-between items-center p-4 gap-4 bg-foreground/20'>
        <h1 className='text-xl font-semibold text-accent'>Landlord Dashboard</h1>
        <div className='flex flex-row gap-4'>
          <div className='flex flex-wrap items-center gap-2'>
            {tabs.map((tab) => (
              <Tab
                key={`/dashboard${tab.slug}`}
                item={tab}
                path='/dashboard'
              />
            ))}
          </div>
        </div>
      </div>
      <div className='p-4'>
        {children}
      </div>
    </div>
  );
};

export default LandlordLayout;
