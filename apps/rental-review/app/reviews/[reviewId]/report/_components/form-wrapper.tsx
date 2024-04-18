'use client';

import React from 'react';
import { useFormState } from 'react-dom';

export type ReportReviewState = {
  message?: string;
};
type FormWrapperProps = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'action'
> & {
  messageClassName?: string;
  action: (
    prevState: ReportReviewState,
    FormData: FormData,
  ) => Promise<ReportReviewState>;
};
const FormWrapper: React.FC<FormWrapperProps> = ({
  messageClassName,
  children,
  action,
  ...rest
}) => {
  const [state, dispatch] = useFormState(action, {});

  return (
    <form action={dispatch} {...rest}>
      {children}
      <p className={messageClassName}>{state.message}</p>
    </form>
  );
};

export default FormWrapper;
