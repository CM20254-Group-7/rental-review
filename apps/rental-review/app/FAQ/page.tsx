import { NextPage } from 'next';

const QandAPage: NextPage = () => (
  <main className='flex flex-1 place-items-center justify-center py-10 md:py-16'>
    <div className='flex w-full max-w-prose flex-col items-center gap-8'>
      <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
        Frequently Asked Questions
      </h2>
      <span className='border-accent w-full border border-b' />

      <div className='flex w-full flex-col gap-2'>
        <div className='mx-5'>
          <h3 className='text-accent text-lg font-semibold'>
            How does Rental Review ensure the authenticity of reviews?
          </h3>
          <p className='italic'>
            Rental Review employs various measures to maintain the authenticity
            of reviews. This includes verifying user accounts through email
            confirmation and employing algorithms to detect suspicious activity.
            Additionally, we encourage users to provide detailed accounts of
            their experiences to ensure transparency. To prevent manipulation,
            landlords can only report false claims on reviews. Our team
            thoroughly investigates reported reviews to ensure fairness and
            accuracy.
          </p>
        </div>
      </div>

      <div className='flex w-full flex-col gap-2'>
        <div className='mx-5'>
          <h3 className='text-accent text-lg font-semibold'>
            What should I do if I suspect a review is fake or biased?
          </h3>
          <p className='italic'>
            If you believe a review is fake or biased, you can report it to our
            team for investigation. We take such reports seriously and will take
            appropriate action if necessary.
          </p>
        </div>
      </div>

      <div className='flex w-full flex-col gap-2'>
        <div className='mx-5'>
          <h3 className='text-accent text-lg font-semibold'>
            Can I edit or delete my review after posting it?
          </h3>
          <p className='italic'>
            Currently, users cannot edit or delete their reviews once they are
            submitted. However, if you have a valid reason for editing or
            removing your review, you can reach out to our support team for
            assistance.
          </p>
        </div>
      </div>

      <div className='flex w-full flex-col gap-2'>
        <div className='mx-5'>
          <h3 className='text-accent text-lg font-semibold'>
            How can I search for properties on Rental Review?
          </h3>
          <p className='italic'>
            You can search for properties on Rental Review by entering relevant
            keywords, location, or specific criteria into the search bar on our
            properties page. You can also use filters to narrow down your search
            results based on your preferences.
          </p>
        </div>
      </div>

      <div className='flex w-full flex-col gap-2'>
        <div className='mx-5'>
          <h3 className='text-accent text-lg font-semibold'>
            Is there a way to contact landlords directly through Rental Review?
          </h3>
          <p className='italic'>
            Rental Review does not facilitate direct communication between
            tenants and landlords. However, landlords may choose to include
            contact information in their property listings for interested
            tenants to reach out to them.
          </p>
        </div>
      </div>

      <div className='flex w-full flex-col gap-2'>
        <div className='mx-5'>
          <h3 className='text-accent text-lg font-semibold'>
            How can I claim ownership of a property on Rental Review?
          </h3>
          <p className='italic'>
            Landlords can claim ownership of their properties by providing proof
            of ownership within a specified timestamp. This typically involves
            verifying ownership through official documents or correspondence.
          </p>
        </div>
      </div>

      <div className='flex w-full flex-col gap-2'>
        <div className='mx-5'>
          <h3 className='text-accent text-lg font-semibold'>
            Are there any guidelines for writing reviews on Rental Review?
          </h3>
          <p className='italic'>
            Yes, we encourage users to follow our community guidelines when
            writing reviews. This includes providing honest and constructive
            feedback while refraining from personal attacks or inappropriate
            language. Reviews should focus on the rental experience and avoid
            unrelated content.
          </p>
        </div>
      </div>
    </div>
  </main>
);

export default QandAPage;
