'use client';

import { useFormState } from 'react-dom';
import React from 'react';
import { State, updatePassword } from './actions';

interface FieldProps {
  name: string
  label: string
  type?: 'password' | 'email' | 'text'
  placeholder?: string
  required?: boolean
  errors?: string[]
}
const Field = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  errors,
}: FieldProps) => (
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
    />
    <p className='text-red-500 h-6'>{errors}</p>
  </div>
);
Field.defaultProps = {
  type: 'text',
  placeholder: '',
  required: false,
  errors: [],
};

// taken from the login form

interface PasswordFieldProps {
  errors?: string[]
}
const PasswordField: React.FC<PasswordFieldProps> = ({ errors }) => (
  <Field
    name='new_password'
    label='New Password'
    type='password'
    placeholder='••••••••'
    required
    errors={errors}
  />
);
PasswordField.defaultProps = {
  errors: [],
};

interface ConfirmPasswordFieldProps {
  errors?: string[]
}
const ConfirmPasswordField: React.FC<ConfirmPasswordFieldProps> = ({ errors }) => (
  <Field
    name='confirmPassword'
    label='Confirm Password'
    type='password'
    placeholder='••••••••'
    required
    errors={errors}
  />
);
ConfirmPasswordField.defaultProps = {
  errors: [],
};

interface FormProps {
  children: React.ReactNode
  dispatch: (formData: FormData) => void
  title: string,
  submitText: string,
}

const Form: React.FC<FormProps> = ({
  children,
  dispatch,

  title,
  submitText,
}) => (
  <form
    className='animate-in h-full flex-1 flex flex-col w-[90vw] sm:max-w-md gap-4 text-foreground border rounded-md shadow-md p-4 bg-background'
    action={dispatch}
  >
    <h2 className='text-2xl pb-1 border-b-2 border-foreground/10'>{title}</h2>

    {/* <span className=''></span> */}

    <div className='flex flex-col flex-1 justify-center gap-4'>
      {children}
    </div>

    <button
      type='submit'
      className='bg-green-700 rounded-md px-4 py-2 text-foreground mb-2'
    >
      {submitText}
    </button>

  </form>
);

const NewPasswordForm = () => {
  const initialState: State = { message: null, errors: {} };
  const [signupState, signupDispatch] = useFormState(updatePassword, initialState);

  return (
    <Form
      dispatch={signupDispatch}
      title='Change Password'
      submitText='Confirm Password'
    >

      <PasswordField errors={signupState.errors?.new_password} />

      <ConfirmPasswordField errors={signupState.errors?.confirmPassword} />
    </Form>
  );
};

export default NewPasswordForm;
