import createClient from '@/utils/supabase/server';
import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense, cache } from 'react';
import { CurrentPropertyResults, PreviousPropertyResults, PropertyResultsLoading } from './PropertyResults';

const getLandlordBio = cache(async (landlordId: string) => {
  // set up the supabase client
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // check if a landlord with the provided id exists and get their info
  const { data: landlordData } = await supabase
    .from('landlord_public_profiles')
    .select('*')
    .eq('user_id', landlordId)
    .single();

  return { ...landlordData };
});

const landlordProfilePage: NextPage<{ params: { landlordId: string } }> = async ({ params: { landlordId } }) => {
  const landlordBio = await getLandlordBio(landlordId);

  if (!landlordBio) notFound();

  return (
    <div>
      {/* Might need to change the format of thing whole div */}
      <h1 style={{ fontSize: '100px' }}>Landlord Profile</h1>
      <p>
        Name:
        {landlordBio.display_name}
      </p>
      <p>
        Email:
        {landlordBio.display_email}
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
