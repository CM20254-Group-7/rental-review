'use client';

import { useFormState } from 'react-dom';
import React from 'react';
import { signIn, signUp, State } from './actions';

type FieldProps = {
  name: string;
  label: string;
  type?: 'password' | 'email' | 'text';
  placeholder?: string;
  required?: boolean;
  errors?: string[];
};
const Field: React.FC<FieldProps> = ({
  name,
  label,
  type,
  placeholder,
  required,
  errors,
}) => (
  <div className='flex flex-col gap-1'>
    <label className='text-md' htmlFor={name}>
      {label}
    </label>
    <input
      className='rounded-md border bg-inherit px-4 py-2'
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
    />
    <p className='h-6 text-red-500'>{errors}</p>
  </div>
);

Field.defaultProps = {
  type: 'text',
  placeholder: undefined,
  required: false,
  errors: undefined,
};

type EmailFieldProps = {
  errors: string[] | undefined;
};
const EmailField: React.FC<EmailFieldProps> = ({ errors }) => (
  <Field
    name='email'
    label='Email'
    type='email'
    placeholder='you@example.com'
    required
    errors={errors}
  />
);

type PasswordFieldProps = {
  errors: string[] | undefined;
};
const PasswordField: React.FC<PasswordFieldProps> = ({ errors }) => (
  <Field
    name='password'
    label='Password'
    type='password'
    placeholder='••••••••'
    required
    errors={errors}
  />
);

type ConfirmPasswordFieldProps = {
  errors: string[] | undefined;
};
const ConfirmPasswordField: React.FC<ConfirmPasswordFieldProps> = ({
  errors,
}) => (
  <Field
    name='confirmPassword'
    label='Confirm Password'
    type='password'
    placeholder='••••••••'
    required
    errors={errors}
  />
);

interface FormProps {
  children: React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  dispatch: (formData: FormData) => void;
  state: State;
  title: string;
  submitText: string;
}

const Form: React.FC<FormProps> = ({
  children,
  dispatch,
  state,
  title,
  submitText,
}) => (
  <form
    className='animate-in text-foreground shadow-accent/10 bg-background flex h-full w-[90vw] flex-1 flex-col gap-4 rounded-md border p-4 shadow-xl sm:max-w-md'
    action={dispatch}
  >
    <h2 className='border-foreground/10 border-b-2 pb-1 text-2xl'>{title}</h2>

    {/* <span className=''></span> */}

    <div className='flex flex-1 flex-col justify-center gap-4'>{children}</div>

    <button
      className=' bg-primary text-background mb-2 rounded-md px-4 py-2'
      type='submit'
    >
      {submitText}
    </button>
    {state?.message && (
      <p className='bg-foreground/10 text-foreground mt-4 p-4 text-center'>
        {state.message}
      </p>
    )}
  </form>
);

export const SignInForm: React.FC<{
  redirectTo?: string;
}> = ({ redirectTo }) => {
  const initialState: State = { message: null, errors: {} };
  const signInWithRedirect = signIn.bind(null, redirectTo);
  const [loginState, loginDispatch] = useFormState(
    signInWithRedirect,
    initialState,
  );

  return (
    <Form
      dispatch={loginDispatch}
      state={loginState}
      title='Returning User? Sign In Here.'
      submitText='Sign In'
    >
      <EmailField errors={loginState.errors?.email} />

      <PasswordField errors={loginState.errors?.password} />
    </Form>
  );
};

SignInForm.defaultProps = {
  redirectTo: undefined,
};

export const SignUpForm: React.FC<{
  redirectTo: string | undefined;
}> = ({ redirectTo }) => {
  const initialState: State = { message: null, errors: {} };
  const signUpWithRedirect = signUp.bind(null, redirectTo);
  const [signupState, signupDispatch] = useFormState(
    signUpWithRedirect,
    initialState,
  );

  return (
    <Form
      dispatch={signupDispatch}
      state={signupState}
      title='New User? Sign Up Here.'
      submitText='Sign Up'
    >
      <EmailField errors={signupState.errors?.email} />

      <PasswordField errors={signupState.errors?.password} />

      <ConfirmPasswordField errors={signupState.errors?.confirmPassword} />
    </Form>
  );
};
