'use client';

import { useFormState } from 'react-dom';
import React from 'react';
import { saveProfile, State } from './actions';

export type FieldProps = {
  name: string
  label: string
  text?: string
  type?: 'password' | 'email' | 'text'
  placeholder?: string
  required?: boolean
  errors?: string[]
}

export const SingleLineField: React.FC<FieldProps> = ({
  name,
  label,
  text,
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
      className='rounded-md px-4 py-2 bg-inherit border'
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      defaultValue={text}
    />
    <p className='text-red-500 h-6'>{errors}</p>
  </div>
);

export const MultiLineField: React.FC<FieldProps> = ({
  name,
  label,
  text,
  placeholder,
  required,
  errors,
}) => (
  <div className='flex flex-col gap-1'>
    <label className='text-md' htmlFor={name}>
      {label}
    </label>
    <textarea
      className='rounded-md px-4 py-2 bg-inherit border'
      name={name}
      rows={10}
      placeholder={placeholder}
      required={required}
    >
      {text}
    </textarea>
    <p className='text-red-500 h-6'>{errors}</p>
  </div>
);

SingleLineField.defaultProps = {
  type: 'text',
  text: '',
  placeholder: undefined,
  required: false,
  errors: undefined,
};

MultiLineField.defaultProps = {
  type: 'text',
  text: '',
  placeholder: undefined,
  required: false,
  errors: undefined,
};

export type EmailFieldProps = {
  email: string,
  errors: string[] | undefined
}

export const EmailField: React.FC<EmailFieldProps> = ({ email, errors }) => (
  <SingleLineField
    name='email'
    label='Email'
    type='email'
    text={email}
    placeholder='you@example.com'
    required
    errors={errors}
  />
);

type BioFieldProps = {
  bio: string,
  errors: string[] | undefined
}

export const BioField: React.FC<BioFieldProps> = ({ bio, errors }) => (
  <MultiLineField
    name='bio'
    label='Bio'
    text={bio}
    placeholder='About you'
    required
    errors={errors}
  />
);

export interface FormProps {
  children: React.ReactNode
  // eslint-disable-next-line no-unused-vars
  dispatch: ((formData: FormData) => void)
  state: State
  title: string,
  submitText: string,
}

export const Form: React.FC<FormProps> = ({
  children,
  dispatch,
  state,
  title,
  submitText,
}) => (
  <form
    className='animate-in h-full flex-1 flex flex-col w-[90vw] sm:max-w-md gap-4 text-foreground border rounded-md shadow-xl shadow-accent/10 p-4 bg-background'
    action={dispatch}
  >
    <h2 className='text-2xl pb-1 border-b-2 border-foreground/10'>{title}</h2>

    {/* <span className=''></span> */}

    <div className='flex flex-col flex-1 justify-center gap-4'>
      {children}
    </div>

    <button
      className=' bg-primary rounded-md px-4 py-2 text-background mb-2'
      type='submit'
    >
      {submitText}
    </button>
    {state?.message && (
      <p className='mt-4 p-4 bg-foreground/10 text-foreground text-center'>
        {state.message}
      </p>
    )}
  </form>
);

export const EditProfileForm: React.FC<{
  email: string,
  bio: string,
  redirectTo?: string
}> = ({ email, bio, redirectTo }) => {
  const initialState: State = { message: null, errors: {} };
  const signInWithRedirect = saveProfile.bind(null, redirectTo);
  const [loginState, loginDispatch] = useFormState(signInWithRedirect, initialState);

  return (
    <Form
      dispatch={loginDispatch}
      state={loginState}
      title='Edit Profile'
      submitText='Save'
    >
      <EmailField email={email} errors={loginState.errors?.email} />

      <BioField bio={bio} errors={loginState.errors?.bio} />
    </Form>
  );
};

EditProfileForm.defaultProps = {
  redirectTo: undefined,
};