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
            <h2 className="text-2xl">{title}</h2>

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
    const initialState = { message: null, errors: {} };
    const [loginState, loginDispatch] = useFormState(signIn, initialState)

    return (
        <Form
            dispatch={loginDispatch}
            state={loginState}
            title='Returning User? Sign In Here.'
            submitText='Sign In'
        >
            <label className="text-md" htmlFor="email">
                Email
            </label>
            <input
                className="rounded-md px-4 py-2 bg-inherit border mb-6"
                name="email"
                placeholder="you@example.com"
                required
            />

            <label className="text-md" htmlFor="password">
                Password
            </label>
            <input
                className="rounded-md px-4 py-2 bg-inherit border mb-6"
                type="password"
                name="password"
                placeholder="••••••••"
                required
            />
        </Form>
    )
}

export const SignUpForm = () => {
    const initialState = { message: null, errors: {} }
    const [signupState, signupDispatch] = useFormState(signUp, initialState)

    return (
        <Form
            dispatch={signupDispatch}
            state={signupState}
            title='New User? Sign Up Here.'
            submitText='Sign Up'
        >
            <label className="text-md" htmlFor="email">
                Email
            </label>
            <input
                className="rounded-md px-4 py-2 bg-inherit border mb-6"
                name="email"
                placeholder="you@example.com"
                required
            />

            <label className="text-md" htmlFor="password">
                Password
            </label>
            <input
                className="rounded-md px-4 py-2 bg-inherit border mb-6"
                type="password"
                name="password"
                placeholder="••••••••"
                required
            />

            <label className="text-md" htmlFor="confirmPassword">
                Confirm Password
            </label>
            <input
                className="rounded-md px-4 py-2 bg-inherit border mb-6"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                required
            />
        </Form>
    )
}