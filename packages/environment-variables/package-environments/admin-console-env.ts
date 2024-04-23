import { createEnv } from '@t3-oss/env-nextjs';
import { vercel } from '@t3-oss/env-nextjs/presets';
import { z } from 'zod';
import { edgeConfigWriteEnv } from '../src/edge-config-write';
import envType from '../src/env-type';
import { defaultIfDev } from '../src/helpers';
import supabaseClientEnv from './supabase-client-env';

// Variables used in /apps/admin-console
// This app needs to write to the edge config
// also hosted on Vercel, so use the Vercel preset
// add our own envType last to override the default value of NEXT_PUBLIC_VERCEL_ENV (can be undefined in vercel preset, we want to default to development)
// also requires additional varaibles for authentication & to link back to the public site
const adminConsoleEnv = createEnv({
  extends: [
    { ...supabaseClientEnv, ...edgeConfigWriteEnv, ...vercel, ...envType },
  ],
  server: {
    ADMIN_ENCRYPTION_KEY: defaultIfDev(
      z.string().min(1),
      'S8euntamhDT1NQM7B3hYTSO9JwaZLK0SOSfwUr2ModQ=',
    ),
    ADMIN_PASSWORD_HASH: defaultIfDev(
      z.string().min(1),
      '$2a$10$kFh8hxekFUmmFPipBRQzyO3tI2eHp8WEINikcqEuPhT0FSm75Rby2',
    ),
  },
  client: {
    NEXT_PUBLIC_PUBLIC_SITE_URL: defaultIfDev(
      z.string().url(),
      'http://localhost:3000',
    ),
  },
  runtimeEnv: {
    ADMIN_ENCRYPTION_KEY: process.env.ADMIN_ENCRYPTION_KEY,
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
    NEXT_PUBLIC_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_PUBLIC_SITE_URL,
  },
});

export default adminConsoleEnv;
