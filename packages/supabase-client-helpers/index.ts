import createAnonSupabaseClient from './generic-client-utils/anon';

import createClientSupabaseClient from './authenticated-client-utils/client';
import createMiddlewareSupabaseClient from './authenticated-client-utils/middleware';

export {
  createAnonSupabaseClient,
  createClientSupabaseClient,
  createMiddlewareSupabaseClient,
};

export type { Database } from './database.types';
