import { createEnv } from "@t3-oss/env-nextjs";

import supabaseClientEnv from "@/src/supabase-client";
import { featureFlagsEnv } from "@/src/feature-flags";
import { vercel } from "@t3-oss/env-nextjs/presets";
import envType from "@/src/env-type";

// Variables used in /apps/renewal-review
// This app needs to use the Supabase client and the feature flags, so it extends from both
// also hosted on Vercel, so use the Vercel preset
// add our own envType last to override the default value of VERCEL_ENV (can be undefined in vercel preset, we want to default to development)
const publicSiteEnv = createEnv({
  extends: [
    { ...supabaseClientEnv, ...featureFlagsEnv, ...vercel, ...envType },
  ],
  runtimeEnv: {},
});

export default publicSiteEnv;