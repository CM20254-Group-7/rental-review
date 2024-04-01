'use server';

import createClient from '@/utils/supabase/server';
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

// Possible Errors:
//
// Missing email or password (gotrue-js)
//  'You must provide either an email or phone number and a password'
//  https://github.com/supabase/gotrue-js/blob/9a0298093e98a65969e43e476f24235ff12022e4/src/GoTrueClient.ts#L523
//
// Email Logins are disabled
//  'Email logins are disabled'
//  https://github.com/supabase/gotrue/blob/73240a0b096977703e3c7d24a224b5641ce47c81/internal/api/token.go#L123
//
// Failed to access database
//  'Database error querying schema'
//  https://github.com/supabase/gotrue/blob/73240a0b096977703e3c7d24a224b5641ce47c81/internal/api/token.go#L141C31-L141C61
//
// Email not confirmed
//  'Email not confirmed'
//  https://github.com/supabase/gotrue/blob/73240a0b096977703e3c7d24a224b5641ce47c81/internal/api/token.go#L188-L191
//
// JWT could not be set
//  'Failed to set JWT cookie'
//  https://github.com/supabase/gotrue/blob/73240a0b096977703e3c7d24a224b5641ce47c81/internal/api/token.go#L208
//
// Generic error (shown when the system does want the user to know exactly what failed for security reasons)
//  'Invalid login credentials'
//  https://github.com/supabase/gotrue/blob/73240a0b096977703e3c7d24a224b5641ce47c81/internal/api/token.go#L78
//  can mean:
//    - Proived email was the empty string - https://github.com/supabase/gotrue/blob/73240a0b096977703e3c7d24a224b5641ce47c81/internal/api/token.go#L134
//    - no user matching the provided email was found - https://github.com/supabase/gotrue/blob/73240a0b096977703e3c7d24a224b5641ce47c81/internal/api/token.go#L139
//    - user is banned - https://github.com/supabase/gotrue/blob/73240a0b096977703e3c7d24a224b5641ce47c81/internal/api/token.go#L145
//    - verification failed - https://github.com/supabase/gotrue/blob/73240a0b096977703e3c7d24a224b5641ce47c81/internal/api/token.go#L181
//    - incorrect password - https://github.com/supabase/gotrue/blob/73240a0b096977703e3c7d24a224b5641ce47c81/internal/api/token.go#L185

// Sign in form does not contain a confirm field
const signInSchema = loginDetailsSchema.omit({ confirmPassword: true });

// type signInResponseMessage =
//   'You must provide either an email or phone number and a password'
//   | 'Email logins are disabled'
//   | 'Database error querying schema'
//   | 'Email not confirmed'
//   | 'Failed to set JWT cookie'
//   | 'Invalid login credentials';

const errorMessages: Record<string, string> = {
  'You must provide either an email or phone number and a password':
    'You must provide either an email or phone number and a password',

  'Email logins are disabled':
    'Sign in currently disabled. Please try again later.',

  'Database error querying schema':
    'Unable to connect to server. Please try again later.',

  'Email not confirmed':
    'Sign in failed, Confirm your email before logging in',

  'Failed to set JWT cookie':
    'Sign in failed, unable to set cookie.',

  'Invalid login credentials':
    'Sign in failed, please check your credentials and try again.',
};

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
      message: Object.keys(errorMessages).includes(error.message) ? errorMessages[error.message] : 'Sign in failed, please check your credentials and try again.',
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
