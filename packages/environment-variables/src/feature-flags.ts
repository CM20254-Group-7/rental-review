// variables required to read from the feature flags

import { createEnv } from '@t3-oss/env-nextjs';
import edgeConfigReadEnv from './edge-config-read';
import { z } from 'zod';

// extends the edge config read environment with the secret used to encrypt flag values in cookies
export const featureFlagsEnv = createEnv({
  extends: [edgeConfigReadEnv],
  server: {
    FLAGS_SECRET: z.string().min(1),
  },
  runtimeEnv: {
    FLAGS_SECRET: process.env.FLAGS_SECRET,
  },
});
