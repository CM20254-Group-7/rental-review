// Variables required to write to the edge config
// Extends from the read environement

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

import edgeConfigReadEnv from './edge-config-read';
import { optionalIfDev } from './helpers';

// values are optional in development as the API cannot be shared
export const edgeConfigWriteEnv = createEnv({
  extends: [edgeConfigReadEnv],
  server: {
    VERCEL_TEAM_ID: optionalIfDev(z.string().min(1)),
    VERCEL_API_KEY: optionalIfDev(z.string().min(1)),
  },
  runtimeEnv: {
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
    VERCEL_API_KEY: process.env.VERCEL_API_KEY,
  },
});
