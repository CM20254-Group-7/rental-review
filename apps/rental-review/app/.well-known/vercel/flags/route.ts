import { NextResponse } from 'next/server';
import { type ApiData } from '@vercel/flags';
import { flags, getFeatureFlagDetails } from '@repo/feature-flags';

export async function GET() {
  const flagValues = await getFeatureFlagDetails();
  const apiData: ApiData = {
    definitions: flagValues,
    overrideEncryptionMode: 'encrypted',
  };
  return NextResponse.json<ApiData>(apiData);
}
