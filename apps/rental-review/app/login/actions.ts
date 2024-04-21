'use server';

import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { z } from 'zod';

// Define the state to be updated by the forms
export type State = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    auth?: string[];
  };
  message?: string | null;
};

// define input schema
const loginDetailsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
});

// Sign up form requires the confirm field to match the password
// - use superRefine rather than refine to allow all failed requirements to be returned
const signUpSchema = loginDetailsSchema
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  })
  // length >= 8
  .superRefine(({ password }, ctx) => {
    if (password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must be at least 8 characters long',
        path: ['password'],
      });
    }
  })
  // contains >= 1 lowercase letter
  .superRefine(({ password }, ctx) => {
    if (!/[a-z]/.test(password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one lowercase letter',
        path: ['password'],
      });
    }
  })
  // contains >= 1 uppercase letter
  .superRefine(({ password }, ctx) => {
    if (!/[A-Z]/.test(password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one uppercase letter',
        path: ['password'],
      });
    }
  })
  // contains >= 1 number
  .superRefine(({ password }, ctx) => {
    if (!/[0-9]/.test(password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one number',
        path: ['password'],
      });
    }
  })
  // contains >= 1 special character
  .superRefine(({ password }, ctx) => {
    if (!/[^a-zA-Z0-9]/.test(password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one special character',
        path: ['password'],
      });
    }
  });

export const signUp = async (
  redirectTo: string | undefined,
  prevState: State,
  formData: FormData,
): Promise<State> => {
  // validate and get the credentials from the form
  const validatedFields = signUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid Fields. Failed to Sign Up User.',
    };
  }
  const { email, password } = validatedFields.data;

  // sign up the user
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    if (error.message === 'User already registered') {
      return {
        errors: {
          email: [error.message],
        },
        message: 'A User with this email already exists.',
      };
    }

    return {
      errors: {
        auth: [error.message],
      },
      message: 'Sign up failed, please check your credentials and try again.',
    };
  }

  return {
    message:
      'Sign up successful. Please check your email for a verification link.',
  };
};
