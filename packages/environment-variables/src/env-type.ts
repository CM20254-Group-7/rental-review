import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// the type of environment that the app is running in
const envType = createEnv({
  server: {
    VERCEL_ENV: z
      .enum(['development', 'preview', 'production'])
      .default('development'),
  },
  runtimeEnv: {
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
});

export default envType;
