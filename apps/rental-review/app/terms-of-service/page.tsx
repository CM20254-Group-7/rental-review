import { NextPage } from 'next';

const PrivacyPolicyPage: NextPage = () => (
  <div className='flex-1 w-screen flex flex-col justify-center items-center py-20'>
    <div className='flex flex-col w-3/4 items-center'>
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>
        Terms of Service
      </h2>
      <span className='border border-b w-full border-accent' />
    </div>
    <br />
    <div className='w-3/4'>
      <h2 className='text-xl font-semibold mb-1'>
        Last Updated: 01/04/2024
      </h2>

      <br />
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of the Rental Review website
        and mobile application (collectively, the &quot;Platform&quot;). By accessing or using
        the Platform, you agree to be bound by these Terms.
      </p>

      <br />
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>
        1. User Eligibility
      </h2>
      <p className='ml-10'>
        You must be at least 18 years old to use the Platform. By using the Platform, you
        represent and warrant that you are of legal age to form a binding contract with us.
      </p>

      <br />
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>
        2. Account Registration
      </h2>
      <p className='ml-10'>
        You may need to create an account to access certain features of the Platform. When
        registering for an account, you agree to provide accurate, current, and complete
        information about yourself.
      </p>

      <br />
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>
        3. User Conduct
      </h2>
      <li className='ml-10 w-fit'>
        You agree to use the Platform for lawful purposes only and to comply with all
        applicable laws and regulations.
      </li>
      <li className='ml-10 w-fit'>
        You may not engage in any conduct that violates the rights of others, including but
        not limited to infringing intellectual property rights, harassing or defaming others,
        or distributing spam or malware.
      </li>

      <br />
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>
        4. Reviews and Ratings
      </h2>
      <li className='ml-10 w-fit'>
        When submitting reviews, ratings and images on the Platform, you agree to provide relevant,
        appropriate, honest and accurate feedback or images based on your personal experiences.
      </li>
      <li className='ml-10 w-fit'>
        You may not submit false or misleading reviews, manipulate ratings, or engage in any
        fraudulent activity related to reviews.
      </li>
      <li className='ml-10 w-fit'>
        We reserve the right to remove reviews that violate these Terms or our review guidelines
        with our moderation system.
      </li>

      <br />
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>
        5. Intellectual Property
      </h2>
      <p className='ml-10'>
        The Platform and its content, including but not limited to text, graphics, logos, and
        software, are protected by copyright, trademark, and other intellectual property laws.
        You may not copy, modify, distribute, or reproduce any part of the Platform without our
        prior written consent.
      </p>

      <br />
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>
        6. Third-Party Links
      </h2>
      <p className='ml-10'>
        The Platform may contain links to third-party websites or services that are not owned
        or controlled by us. We are not responsible for the content or practices of any third-party
        sites and encourage you to review their terms of service and privacy policies.
      </p>

      <br />
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>
        7. Disclaimer of Warranties
      </h2>
      <p className='ml-10'>
        The Platform is provided &quot;as is&quot; and &quot;as available&quot; without any
        warranties of any kind. We do not guarantee that the Platform will always be secure,
        error-free, or uninterrupted.
      </p>

      <br />
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>
        8. Limitation of Liability
      </h2>
      <p className='ml-10'>
        In no event shall we be liable for any indirect, incidental, special, consequential, or
        punitive damages, including but not limited to loss of profits, data, or goodwill, arising
        out of or in connection with your use of the Platform.
      </p>

      <br />
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>
        9. Governing Law
      </h2>
      <p className='ml-10'>
        These Terms are governed by and construed in accordance with the laws of the State of
        the United Kingdom, without regard to its conflict of law principles.
      </p>

      <br />
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>
        10. Changes to This Policy
      </h2>
      <p className='ml-10'>
        We reserve the right to update or modify this Privacy Policy at any time. We will notify
        you of any changes by posting the revised policy on the Platform with the effective date
        indicated at the top.
      </p>

      <br />
      <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>
        11. Contact Us
      </h2>
      <p className='ml-10'>
        If you have any questions, concerns, or feedback regarding this Privacy Policy or our
        privacy practices, please contact us at
        {' '}
        <a
          className='underline text-blue-500 transition-colors duration-300 ease-in-out
          hover:text-blue-600'
          href='mailto:help.rentalreview@gmail.com'
        >
          help.rentalreview@gmail.com
        </a>
        .
      </p>

      <i className='flex-1 flex flex-col justify-center items-center py-20 text-accent'>
        Note: This document is generated by ChatGPT.
      </i>
    </div>
  </div>
);

export default PrivacyPolicyPage;
