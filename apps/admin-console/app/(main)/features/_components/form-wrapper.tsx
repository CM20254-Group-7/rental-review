'use client';

import { useFormState, useFormStatus } from 'react-dom';
import React, { PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { updateFlags } from '../actions';

export const Form: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useFormState(updateFlags, undefined);

  useEffect(() => {
    if (state) {
      toast(state.error ? 'Error updating flags' : 'Flags updated');
    }
  }, [state]);

  return (
    <form className='contents' action={dispatch}>
      {children}
    </form>
  );
};

export const SubmitButton: React.FC = () => {
  const { pending } = useFormStatus();
  return (
    <Button size='sm' variant='default' disabled={pending} type='submit'>
      Save Changes
    </Button>
  );
};
