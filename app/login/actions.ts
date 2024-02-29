'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Define the state to be updated by the forms
export type State = {
  errors?: {
    email?: string[]
    password?: string[],
    confirmPassword?: string[],
    auth?: string[],
  };
  message?: string | null;
};

// define input schema
const loginDetailsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
});

// Sign in form does not contain a confirm field
const signInSchema = loginDetailsSchema.omit({ confirmPassword: true });

export const signIn = async (
  redirectTo: string | undefined,
  prevState: State,
  formData: FormData,
): Promise<State> => {
  // validate and get the credentials from the form
  const validatedFields = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid Fields. Failed to Sign In User.',
    };
  }

  const {
    email,
    password,
  } = validatedFields.data;

  // login the user
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      errors: {
        auth: [error.message],
      },
      message: 'Sign in failed, please check your credentials and try again.',
    };
  }

  return redirect(redirectTo || '/');
};

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
  .superRefine(({ password }, ctx) => {
    if (password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must be at least 6 characters long',
        path: ['password'],
      });
    }
  });
// TODO: add other password complexity checks
// TODO: add email uniqueness check here or in function body

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
  const {
    email,
    password,
  } = validatedFields.data;

  // sign up the user
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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
    message: 'Sign up successful. Please check your email for a verification link.',
  };
};
