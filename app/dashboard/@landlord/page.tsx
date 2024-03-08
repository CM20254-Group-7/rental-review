import React from 'react';
import { NextPage } from 'next';
import { cookies } from 'next/headers';
import createClient from '@/utils/supabase/server';

const LandlordDashboard: NextPage = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  // unauthenticated users should be handled by middleware
  // return null to assert types
  if (!user) return null;

  return (
    <div>
      <div className='flex flex-col gap-1 items-center'>
        <h3 className='font-bold text-2xl text-accent'>Landlord Dashboard</h3>
        <p className='mb-6 text-lg'>TODO: Put general landlord info here</p>
        <p>Maybe add a 'your rating over time' graph</p>
        <p>Could list the current ranking position?</p>
      </div>
    </div>
  );
};

export default LandlordDashboard;
