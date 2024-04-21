'use client';

import React, { useEffect } from 'react';
import { NextUIProvider } from '@nextui-org/system';
import { createClientSupabaseClient } from '@repo/supabase-client-helpers';
import { useRouter } from 'next/navigation';

type User = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof createClientSupabaseClient>['auth']['getUser']>
  >['data']['user']
>;

type Session = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof createClientSupabaseClient>['auth']['getSession']
    >
  >['data']['session']
>;

export const SupabaseUserContext = React.createContext<{
  user: User | null;
  session: Session | null;
}>({
  user: null,
  session: null,
  // user: (await createClientSupabaseClient().auth.getUser()).data.user,
  // session: (await createClientSupabaseClient().auth.getSession()).data.session,
});

const SupabaseUserProvider: React.FC<{
  children: React.ReactNode;
  initialUser: User | null;
}> = ({ children, initialUser }) => {
  const supabase = createClientSupabaseClient();
  const { refresh } = useRouter();

  const [user, setUser] = React.useState<User | null>(initialUser);
  const [session, setSession] = React.useState<Session | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setUser(newSession?.user ?? null);
      setSession(newSession);

      // Refresh the page on sign out to ensure the user is redirected to the login page if they are on a page that requires authentication.
      if (event === 'SIGNED_OUT') refresh();
    });

    return subscription.unsubscribe;
  }, [supabase, refresh]);

  const value = React.useMemo(() => ({ user, session }), [user, session]);

  return (
    <SupabaseUserContext.Provider value={value}>
      {children}
    </SupabaseUserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(SupabaseUserContext);
  if (context === undefined) {
    throw new Error(
      'useUser must be used on the client within a AuthContextProvider.',
    );
  }
  return context;
};

const Providers: React.FC<{
  children: React.ReactNode;
  initialUser: User | null;
}> = ({ children, initialUser }) => (
  <NextUIProvider className='contents'>
    <SupabaseUserProvider initialUser={initialUser}>
      {children}
    </SupabaseUserProvider>
  </NextUIProvider>
);

export default Providers;
