import createClient from '@/utils/supabase/server';
import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CurrentPropertyResults, PreviousPropertyResults, PropertyResultsLoading } from './PropertyResults';

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
      <div>
        <h2>Properties</h2>
        <div>
          <div>
            <h3>Currently Owned</h3>
            <Suspense fallback={<PropertyResultsLoading />}>
              <CurrentPropertyResults landlordId={landlordId} />
            </Suspense>
          </div>
          <div>
            <h3>Previously Owned</h3>
            <Suspense fallback={<PropertyResultsLoading />}>
              <PreviousPropertyResults landlordId={landlordId} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default landlordProfilePage;
