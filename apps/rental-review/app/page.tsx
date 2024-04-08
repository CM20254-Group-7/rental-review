import { NextPage } from 'next';
import React from 'react';

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div
    className='flex flex-col items-center rounded-xl bg-primary/40 p-6 pb-8 gap-4 border shadow-2xl shadow-primary/40 dark:shadow-primary/20'
    title='General information.'
  >
    {/* Card Header */}
    <div className='flex flex-col items-center w-full'>
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>{title}</h2>
      <span className='border border-b w-full border-accent' />
    </div>

    {/* Card Body */}
    <div className='flex flex-col gap-2'>{children}</div>
  </div>
);

const HomePage: NextPage = () => (
  <div className='flex-grow flex-1 w-full flex flex-col gap-20 items-center py-10'>
    {/* Header */}
    <div className='flex flex-col gap-1 items-center'>
      <h1 className='font-semibold text-6xl mb-4 mt-3 text-primary'>
        Rental Review
      </h1>
      <h2 className='font-bold text-2xl mb-4'>
        Helping to fix the UK&apos;s rental sector one review at a time
      </h2>
    </div>

    {/* Descriptions */}
    <div className='flex flex-col w-full max-w-prose justify-center text-justify gap-16'>
      <Card title='General Info'>
        <p className='ml-5 mr-5'>
          This web app is designed to help tenants view properties and get
          verified information about them from previous tenants. Users are able
          to leave reviews for a property or landlord. Equally, we help tenants
          and landlords to verify reviews and report any misinformation.
        </p>
      </Card>

      <Card title='About Us'>
        <p className='ml-5 mr-5'>
          We are a diverse collection of students from the University of Bath,
          located in the United Kingdom. We are working together on this project
          with the sole purpose of helping tenants (and landlords) get better
          information about where they&apos;ll be living, along with information
          about landlords which might not be freely available.
          <br />
          <br />
          The goal of this is to balance the power dynamic between tenants and
          landlords, the latter of which being capable of verifying information
          about tenants, which is not applicable the other way around. We want
          to avoid problems such as landlords leaving the house in unliveable
          conditions, or more minor things such as the landlord being impossible
          to contact.
        </p>
      </Card>

      <Card title='Getting Started'>
        <h2 className='font-semibold mb-1 w-fit text-accent'>
          Searching for Properties
        </h2>
        <p className='ml-5 mr-5 mb-5'>
          To search for properties, you can click on the properties button at
          the top of the page. You can then search for a property by entering
          the address or postcode and clicking the search button.
        </p>
        <h2 className='font-semibold mb-1 w-fit text-accent'>
          Leaving Reviews
        </h2>
        <p className='ml-5 mr-5 mb-5'>
          To leave a review, you will need to sign up and log in to the website.
          Once you have done this, you can leave a review by clicking on the
          property you want to leave a review for and click the &quot;Leave
          Review&quot; button.
        </p>
        <h2 className='font-semibold mb-1 w-fit text-accent'>
          Landlords tasks
        </h2>
        <p className='ml-5 mr-5'>
          Landlords can search for their property and view the reviews left.
          They can also claim the property and receive an average rating from
          the reviews.
        </p>
      </Card>
    </div>
  </div>
);

export default HomePage;
