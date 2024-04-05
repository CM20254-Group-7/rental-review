'use server';

import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export type State = {
  errors?: {
    new_email?: string[]
    auth?: string[],
  };
  message?: string | null;
};

const accountDetails = z.object({
  new_email: z.string(),
});

const newAccountSchema = accountDetails

  .superRefine(({ new_email: newEmail }, ctx) => {
    if (!newEmail.includes('@')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'This is not a valid email address',
        path: ['new_email'],
      });
    }
  });

export const updateInfo = async (prevState: State, formData: FormData): Promise<State> => {
  const validatedFields = newAccountSchema.safeParse({
    new_email: formData.get('email'),

  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid Fields. Failed to update infomation.',
    };
  }
  const {
    new_email: newEmail,
  } = validatedFields.data;

  const supabase = createServerSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  if (error) {
    return {
      errors: {
        auth: [error.message],
      },
    };
  }
  return (

    redirect('/')
  );
};
