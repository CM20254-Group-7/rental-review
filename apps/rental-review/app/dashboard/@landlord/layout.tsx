import Tab from '../tab';

const LandlordLayout: React.FC<{
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
    <div className='bg-accent/20 flex w-screen max-w-prose flex-col gap-2 rounded-md'>
      <div className='bg-foreground/20 flex flex-row items-center justify-between gap-4 p-4'>
        <h1 className='text-accent text-xl font-semibold'>
          Landlord Dashboard
        </h1>
        <div className='flex flex-row gap-4'>
          <div className='flex flex-wrap items-center gap-2'>
            {tabs.map((tab) => (
              <Tab key={`/dashboard${tab.slug}`} item={tab} path='/dashboard' />
            ))}
          </div>
        </div>
      </div>
      <div className='p-4'>{children}</div>
    </div>
  );
};

export default LandlordLayout;
