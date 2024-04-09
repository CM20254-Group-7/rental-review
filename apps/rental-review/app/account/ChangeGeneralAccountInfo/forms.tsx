'use client';

import { useFormState } from 'react-dom';
import React from 'react';
import { State, updateInfo } from './actions';

interface FieldProps {
  name: string;
  label: string;
  type?: 'email' | 'text';
  required?: boolean;
  errors?: string[];
}

const Field = ({
  name,
  label,
  type = 'text',

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
      required={required}
    />
    <p className='h-6 text-red-500'>{errors}</p>
  </div>
);
Field.defaultProps = {
  type: 'text',
  required: false,
  errors: [],
};

interface EmailFieldProps {
  errors?: string[];
}
const EmailField: React.FC<EmailFieldProps> = ({ errors }) => (
  <Field name='email' label='Email' type='email' required errors={errors} />
);
EmailField.defaultProps = {
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

const UpdateProfileForm = () => {
  const initialState: State = { message: null, errors: {} };

  const [displayState, updateDispatch] = useFormState(updateInfo, initialState);

  // TO-DO: make it so the form starts with all the infomation already filled

  // const supabase = createClient()
  // const [user, setUser ] = useState<User|null>(null)

  // supabase.auth.getUser().then(({data, error }) => {
  //  setUser(data.user)
  // })

  // console.log(user)
  // console.log("this is the form user")

  // if (user != null){

  return (
    <Form
      dispatch={updateDispatch}
      title='Account Info'
      submitText='Save Changes'
    >
      <EmailField errors={displayState.errors?.new_email} />
    </Form>
  );

  // }
};

export default UpdateProfileForm;
