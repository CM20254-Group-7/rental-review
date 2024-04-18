import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';
import supabaseClientEnv from '@/src/supabase-client';
import publicSiteEnv from '@/package-environments/rental-review-env';
import adminConsoleEnv from '@/package-environments/admin-console-env';

// Variables used in tests
// Test script will start the public site and the admin console so must be passed the env for both
// Also makes direct requests to the Supabase client
// Additionally uses the CI flag in GitHub Actions so included also
const testEnv = createEnv({
  extends: [{ ...publicSiteEnv, ...adminConsoleEnv, ...supabaseClientEnv }],
  server: {
    CI: z.coerce.boolean().default(false),
  },
  runtimeEnv: {
    CI: process.env.CI,
  },
});

export default testEnv;
