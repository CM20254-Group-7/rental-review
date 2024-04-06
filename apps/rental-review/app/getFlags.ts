'use server';

import { FlagOverridesType, decrypt } from '@vercel/flags';
import { cookies } from 'next/headers';
import { get } from '@vercel/edge-config';

async function getFlags() {
  const overrideCookie = cookies().get('vercel-flag-overrides')?.value;

  const overrides = overrideCookie
    ? await decrypt<FlagOverridesType>(overrideCookie)
    : {};

  const flags = {
    newFeature: overrides?.newFeature ?? (await get('newFeature')) ?? true,
  };

  return flags;
}

export default getFlags;
