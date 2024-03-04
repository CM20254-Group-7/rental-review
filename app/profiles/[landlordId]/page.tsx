import Image from 'next/image';

import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import AverageLandlordRating from './AverageLandlordRating';

export default async function landlordProfilePage({ params }: { params: { landlordId: string } }) {
  // check if a landlord id was provided
  const { landlordId } = params;

  // set up the supabase client
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // check if a landlord with the provided id exists and get their info
  const { data: landlordData, error: landlordError } = await supabase
    .from('landlord_public_profiles')
    .select('*')
    .eq('user_id', landlordId)
    .single();

  // landlord not found
  if (landlordError || !landlordData) {
    notFound();
  }

  // get the properties associated with the landlord and get their info
  const { data: landlordProperties, error: landlordPropertiesError } = await supabase
    .from('property_ownership')
    .select('property_id')
    .eq('landlord_id', landlordId);

  if (landlordPropertiesError) {
    return (
      <div>
        <h1>ERROR: Unable to fetch landlord properties</h1>
      </div>
    );
  }

  let propertyDetails: { address: string }[] = [];
  if (landlordProperties !== null) {
    const { data: details, error: propertyDetailsError } = await supabase
      .rpc('properties_full')
      .in('id', landlordProperties.map((property) => property.property_id))
      .select('id, address');

    if (propertyDetailsError) {
      return (
        <div>
          <h1>ERROR: Unable to fetch property details</h1>
        </div>
      );
    }
    propertyDetails = details;
  }

  return (
    <div className='flex-1 flex flex-col w-full px-16 justify-top items-center gap-2 py-20'>
      {/* Content Boundary */}
      <div className='flex flex-col w-full max-w-4xl bg-secondary/10 shadow-md shadow-secondary/40 rounded-lg overflow-clip border'>
        {/* Details Header */}
        <div className='flex flex-row w-full justify-between gap-2 bg-secondary/30 shadow-lg shadow-secondary/40'>
          {/* Images - Currently not implemented so shows example image with disclaimer */}
          <div className='relative w-full max-w-md aspect-[1000/682] rounded-full overflow-hidden'>
            <Image
              className='absolute w-full max-w-md rounded-full'
              src='/profile_picture.png'
              width={1000}
              height={682}
              alt='Profile picture of a landlord'
            />
            <div className='w-full h-full bg-background/40 backdrop-blur flex flex-col place-items-center justify-center'>
              <p className='text-lg font-semibold text-foreground'>Profile Images Coming Soon</p>
            </div>
          </div>
          {/* General Landlord Details */}
          <div className='flex-1 flex flex-col w-full px-8 sm:max-w-md justify-top gap-2 py-4'>
            {/* Name */}
            <div className='flex flex-col w-full'>
              <h2 className='text-2xl font-semibold mb-1 w-fit text-accent'>{landlordData.display_name}</h2>
              <span className='border border-b w-full border-accent' />
            </div>

            {/* Average Ratings */}
            <div className='flex flex-col w-full'>
              <h2 className='text-lg font-semibold mb-1 w-fit text-accent'>Average Rating</h2>
              <p className='text-base'>
                <Suspense fallback={<ArrowPathIcon className='w-5 h-5 animate-spin' />}>
                  <AverageLandlordRating landlordId={landlordData.user_id} />
                </Suspense>
              </p>
            </div>

            {/* Email */}
            <div className='flex flex-col w-full'>
              <h2 className='text-lg font-semibold mb-1 w-fit text-accent'>Contact Email</h2>
              <p className='text-base'>
                <a href={`mailto:${landlordData.display_email}`} className='text-blue-600 hover:underline'>{landlordData.display_email}</a>
              </p>
            </div>

            {/* Bio */}
            <div className='flex flex-col w-full'>
              <h2 className='text-lg font-semibold mb-1 w-fit text-accent'>Bio</h2>
              <p className='text-base'>{landlordData.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  // TODO: Add properties section
  //       - Fetch properties from the database
  //       - Display properties similar to how the reviews are displayed on the property page
  //       - Add a link to the property page
  //       - Show "No properties" if the landlord has no properties

  // OLD CODE
  // CAN BE REMOVED LATER
  // USE THIS AS A REFERENCE FOR THE NEW CODE
  // <div>
  //   {/* Might need to change the format of thing whole div */}
  //   <h1 style={{ fontSize: '100px' }}>Landlord Profile</h1>

  //   {/* only show the rating if the landlord has it */}
  //   {landlordRating !== null && (
  //     <div>
  //       <h2>Rating</h2>
  //       <p>{landlordRating}</p>
  //     </div>
  //   )}

  //   <p>
  //     Name:
  //     {landlordData.display_name}
  //   </p>
  //   <p>
  //     Email:
  //     {landlordData.display_email}
  //   </p>
  //   <p>
  //     Bio:
  //     {landlordBio.bio}
  //   </p>
  //   {/* only show the properties if the landlord has it */}
  //   {propertyDetails !== null && (
  //     <div>
  //       {propertyDetails.length === 0 ? (
  //         <p>No properties</p>
  //       ) : (
  //         <div>
  //           <h2>Properties</h2>
  //           <ul>
  //             {propertyDetails.map((property) => (
  //               <li key={property.address}>
  //                 <h3>{property.address}</h3>
  //                 <p style={{ textAlign: 'center', backgroundColor: 'red' }}>NEED TO ADD LINK TO THE PROPERTY!!!</p>
  //               </li>
  //             ))}
  //           </ul>
  //         </div>
  //       )}
  //     </div>
  //   )}
  // </div>
  );
}
