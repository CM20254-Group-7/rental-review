'use client';

import { Button, ButtonProps } from '@tremor/react';
import { useFormStatus } from 'react-dom';

const FormSubmitButton: React.FC<ButtonProps> = ({
  disabled,
  children,
  ...rest
}) => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={disabled || pending} {...rest}>
      {children}
    </Button>
  );
};

export default FormSubmitButton;
