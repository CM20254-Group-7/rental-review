import { NextPage } from 'next';

const QandAPage: NextPage = () => (
  <div className='flex-1 w-screen flex flex-row justify-center items-center py-20'>
    <div className='flex flex-col w-full max-w-prose gap-8 items-center'>
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>Frequently Asked Questions</h2>
      <span className='border border-b w-full border-accent' />

      <div className='flex flex-col gap-2 w-full'>
        <div className='mx-5'>
          <h3 className='text-lg font-semibold text-accent'>
            How does Rental Review ensure the authenticity of reviews?
          </h3>
          <p className='italic'>
            Rental Review employs various measures to maintain the authenticity of reviews.
            This includes verifying user accounts through email confirmation and employing
            algorithms to detect suspicious activity. Additionally, we encourage users to
            provide detailed accounts of their experiences to ensure transparency. To prevent
            manipulation, landlords can only report false claims on reviews. Our team
            thoroughly investigates reported reviews to ensure fairness and accuracy.
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <div className='mx-5'>
          <h3 className='text-lg font-semibold text-accent'>
            What should I do if I suspect a review is fake or biased?
          </h3>
          <p className='italic'>
            If you believe a review is fake or biased, you can report it to our team for
            investigation. We take such reports seriously and will take appropriate action
            if necessary.
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <div className='mx-5'>
          <h3 className='text-lg font-semibold text-accent'>
            Can I edit or delete my review after posting it?
          </h3>
          <p className='italic'>
            Currently, users cannot edit or delete their reviews once they are submitted.
            However, if you have a valid reason for editing or removing your review, you
            can reach out to our support team for assistance.
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <div className='mx-5'>
          <h3 className='text-lg font-semibold text-accent'>
            How can I search for properties on Rental Review?
          </h3>
          <p className='italic'>
            You can search for properties on Rental Review by entering relevant keywords,
            location, or specific criteria into the search bar on our properties page. You
            can also use filters to narrow down your search results based on your preferences.
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <div className='mx-5'>
          <h3 className='text-lg font-semibold text-accent'>
            Is there a way to contact landlords directly through Rental Review?
          </h3>
          <p className='italic'>
            Rental Review does not facilitate direct communication between tenants and landlords.
            However, landlords may choose to include contact information in their property
            listings for interested tenants to reach out to them.
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <div className='mx-5'>
          <h3 className='text-lg font-semibold text-accent'>
            How can I claim ownership of a property on Rental Review?
          </h3>
          <p className='italic'>
            Landlords can claim ownership of their properties by providing proof of ownership
            within a specified timestamp. This typically involves verifying ownership through
            official documents or correspondence.
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <div className='mx-5'>
          <h3 className='text-lg font-semibold text-accent'>
            Are there any guidelines for writing reviews on Rental Review?
          </h3>
          <p className='italic'>
            Yes, we encourage users to follow our community guidelines when writing reviews.
            This includes providing honest and constructive feedback while refraining from
            personal attacks or inappropriate language. Reviews should focus on the rental
            experience and avoid unrelated content.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default QandAPage;
