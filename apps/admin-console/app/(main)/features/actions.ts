'use server';

import { flags } from '@repo/feature-flags';
import { parseConnectionString } from '@vercel/edge-config';

type State =
  | {
      result: unknown;
      error: null;
    }
  | {
      result: null;
      error: unknown;
    }
  | undefined;
export const updateFlags = async (
  prevState: State,
  formData: FormData,
): Promise<State> => {
  const newFlagValues = Object.entries(flags).reduce((acc, [name, flag]) => {
    const value = formData.get(name);
    if (value === undefined || value === '') return acc;
    return {
      ...acc,
      [name]:
        flag.options?.find((option) => option.label === value)?.value ?? value,
    };
  }, {});

  try {
    const createEdgeConfig = await fetch(
      `https://api.vercel.com/v1/edge-config/${parseConnectionString(process.env.EDGE_CONFIG!)?.id}/items?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'update',
              key: 'featureFlags',
              value: newFlagValues,
            },
          ],
        }),
      },
    );
    const result = await createEdgeConfig.json();
    // console.log(result);
    return { result, error: null };
  } catch (error) {
    // console.log(error);
    return { result: null, error };
  }
};

export const updateToolbarSettings = async (
  toolbarVisible: boolean,
  toolbarUsers: string[],
) => {
  try {
    const createEdgeConfig = await fetch(
      `https://api.vercel.com/v1/edge-config/${parseConnectionString(process.env.EDGE_CONFIG!)?.id}/items?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'upsert',
              key: 'toolbarAlwaysVisible',
              value: toolbarVisible,
            },
            {
              operation: 'upsert',
              key: 'toolbarUsers',
              value: toolbarUsers,
            },
          ],
        }),
      },
    );
    const result = await createEdgeConfig.json();
    // console.log(result);
    return { result, error: null };
  } catch (error) {
    // console.log(error);
    return { result: null, error };
  }
};
