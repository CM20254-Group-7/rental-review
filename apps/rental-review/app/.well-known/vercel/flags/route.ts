import { NextResponse } from 'next/server';
import { type ApiData } from '@vercel/flags';

export async function GET() {
  const apiData: ApiData = {
    definitions: {
      newFeature: {
        description: 'Controls whether the new feature is visible',
        origin: 'https://example.com/#new-feature',
        options: [
          { value: false, label: 'Off' },
          { value: true, label: 'On' },
        ],
      },
    },
    overrideEncryptionMode: 'encrypted',
  };
  return NextResponse.json<ApiData>(apiData);
}
