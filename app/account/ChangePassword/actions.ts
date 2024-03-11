'use server';

import createClient from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Define the state to be updated by the forms
export type State = {
  errors?: {
    email?: string[]
    new_password?: string[],
    confirmPassword?: string[],
    auth?: string[],
  };
  message?: string | null;
};

// define input schema
const passwordDetails = z.object({
  new_password: z.string(),
  confirmPassword: z.string(),

});

const newPasswordSchema = passwordDetails

  .superRefine(({ new_password: newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  })
  .superRefine(({ new_password: newPassword }, ctx) => {
    if (newPassword.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must be at least 6 characters long',
        path: ['password'],
      });
    }
  });

export const updatePassword = async (prevState: State, formData: FormData): Promise<State> => {
  const validatedFields = newPasswordSchema.safeParse({
    new_password: formData.get('new_password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid Fields.',
    };
  }
  const {
    new_password: newPassword,
  } = validatedFields.data;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      errors: {
        auth: [error.message],
      },
    };
  }
  return (

    redirect('/account')
  );
};
