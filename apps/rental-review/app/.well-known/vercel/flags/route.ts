import { NextResponse } from 'next/server';
import { type ApiData } from '@vercel/flags';
import { flags } from '@repo/feature-flags';

export async function GET() {
  const apiData: ApiData = {
    definitions: flags,
    overrideEncryptionMode: 'encrypted',
  };
  return NextResponse.json<ApiData>(apiData);
}
