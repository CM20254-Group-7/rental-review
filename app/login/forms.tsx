'use client'

import { signIn, signUp, State } from './actions'
import { useFormState } from 'react-dom'

interface FormProps {
    children: React.ReactNode
    dispatch: (formData: FormData) => void
    state: State
    title: string,
    submitText: string,
}

const Form: React.FC<FormProps> = ({
    children,
    dispatch,
    state,
    title,
    submitText,
}) => {
    return (
        <form
            className="animate-in h-full flex-1 flex flex-col w-[90vw] sm:max-w-md gap-4 text-foreground border rounded-md shadow-md p-4 bg-background"
            action={dispatch}
        >
            <h2 className="text-2xl pb-1 border-b-2 border-foreground/10">{title}</h2>

            {/* <span className=''></span> */}

            <div className='flex flex-col flex-1 justify-center gap-4'>
                {children}
            </div>

            <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
                {submitText}
            </button>
            {state?.message && (
                <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                    {state.message}
                </p>
            )}
        </form>
    )
}

export const SignInForm = () => {
    const initialState: State = { message: null, errors: {} };
    const [loginState, loginDispatch] = useFormState(signIn, initialState)

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
    )
}

export const SignUpForm = () => {
    const initialState: State = { message: null, errors: {} }
    const [signupState, signupDispatch] = useFormState(signUp, initialState)

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
    )
}

interface Field {
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
}: Field) => {
    return (
        <div className='flex flex-col gap-1'>
            <label className="text-md" htmlFor={name}>
                {label}
            </label>
            <input
                className="rounded-md px-4 py-2 bg-inherit border"
                type={type}
                name={name}
                placeholder={placeholder}
                required={required}
            />
            <p className="text-red-500 h-6">{errors}</p>
        </div>
    )
}

interface EmailFieldProps {
    errors?: string[]
}
const EmailField: React.FC<EmailFieldProps> = ({ errors }) => <Field
    name="email"
    label="Email"
    type="email"
    placeholder="you@example.com"
    required
    errors={errors}
/>

interface PasswordFieldProps {
    errors?: string[]
}
const PasswordField: React.FC<PasswordFieldProps> = ({ errors }) => <Field
    name="password"
    label="Password"
    type="password"
    placeholder="••••••••"
    required
    errors={errors}
/>

interface ConfirmPasswordFieldProps {
    errors?: string[]
}
const ConfirmPasswordField: React.FC<ConfirmPasswordFieldProps> = ({ errors }) => <Field
    name="confirmPassword"
    label="Confirm Password"
    type="password"
    placeholder="••••••••"
    required
    errors={errors}
/>