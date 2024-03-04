import createClient from '@/utils/supabase/server';
import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

const landlordProfilePage: NextPage<{ params: { landlordId: string } }> = async ({ params: { landlordId } }) => {
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

  // get the landlord bio
  const { data: landlordBio, error: landlordBioError } = await supabase
    .from('landlord_public_profiles')
    .select('bio')
    .eq('user_id', landlordId)
    .single();

  if (landlordBioError) {
    return (
      <div>
        <h1>ERROR: Unable to fetch landlord bio</h1>
      </div>
    );
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
    <div>
      {/* Might need to change the format of thing whole div */}
      <h1 style={{ fontSize: '100px' }}>Landlord Profile</h1>
      <p>
        Name:
        {landlordData.display_name}
      </p>
      <p>
        Email:
        {landlordData.display_email}
      </p>
      <p>
        Bio:
        {landlordBio.bio}
      </p>
      {/* only show the properties if the landlord has it */}
      {propertyDetails !== null && (
        <div>
          {propertyDetails.length === 0 ? (
            <p>No properties</p>
          ) : (
            <div>
              <h2>Properties</h2>
              <ul>
                {propertyDetails.map((property) => (
                  <li key={property.address}>
                    <h3>{property.address}</h3>
                    <p style={{ textAlign: 'center', backgroundColor: 'red' }}>NEED TO ADD LINK TO THE PROPERTY!!!</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default landlordProfilePage;
