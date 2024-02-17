'use client'

import { signIn, signUp, State } from './actions'
import { useFormState } from 'react-dom'

interface FormProps {
    children: React.ReactNode
    dispatch: (formData: FormData) => void
    state: State
    submitText: string,
}

const Form: React.FC<FormProps> = ({
    children,
    dispatch,
    state,
    submitText,
}) => {
    return (
        <form
            className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
            action={dispatch}
        >
            {children}
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