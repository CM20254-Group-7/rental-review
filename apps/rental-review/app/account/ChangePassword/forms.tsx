'use client';

import { useFormState } from 'react-dom';
import React from 'react';
import { State, updatePassword } from './actions';

interface FieldProps {
  name: string;
  label: string;
  type?: 'password' | 'email' | 'text';
  placeholder?: string;
  required?: boolean;
  errors?: string[];
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
  placeholder: '',
  required: false,
  errors: [],
};

// taken from the login form

interface PasswordFieldProps {
  errors?: string[];
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
  errors?: string[];
}
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
ConfirmPasswordField.defaultProps = {
  errors: [],
};

interface FormProps {
  children: React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  dispatch: (formData: FormData) => void;
  title: string;
  submitText: string;
}

const Form: React.FC<FormProps> = ({
  children,
  dispatch,

  title,
  submitText,
}) => (
  <form
    className='animate-in text-foreground bg-background flex h-full w-[90vw] flex-1 flex-col gap-4 rounded-md border p-4 shadow-md sm:max-w-md'
    action={dispatch}
  >
    <h2 className='border-foreground/10 border-b-2 pb-1 text-2xl'>{title}</h2>

    {/* <span className=''></span> */}

    <div className='flex flex-1 flex-col justify-center gap-4'>{children}</div>

    <button
      type='submit'
      className='text-foreground mb-2 rounded-md bg-green-700 px-4 py-2'
    >
      {submitText}
    </button>
  </form>
);

const NewPasswordForm = () => {
  const initialState: State = { message: null, errors: {} };
  const [signupState, signupDispatch] = useFormState(
    updatePassword,
    initialState,
  );

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
