'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { CardContent, CardFooter } from '@/components/ui/card';
import { SubmitButton } from './form-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CaretSortIcon } from '@radix-ui/react-icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { updateToolbarSettings } from '../actions';

const FormSchema = z.object({
  show_for_everyone: z.boolean(),
  show_for_users: z.array(z.string()),
  // security_emails: z.boolean(),
});

const ToolbarSettingsForm: React.FC<{
  userEmails: string[];
  toolbarUsers: string[];
}> = ({ userEmails, toolbarUsers: initialToolbarUsers }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      show_for_everyone: false,
      show_for_users: initialToolbarUsers,
      // security_emails: true,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast('You submitted the following values', {
      description: JSON.stringify(data, null, 2),
    });
    updateToolbarSettings(data.show_for_everyone, data.show_for_users).then(
      ({ result, error }) => {
        toast(
          error
            ? 'Failed to update toolbar settings'
            : 'Toolbar settings updated',
          {
            description: JSON.stringify(result ?? error, null, 2),
          },
        );
      },
    );
  }

  const { watch } = form;
  const watchShowForEveryone = watch('show_for_everyone');
  const watchShowForUsers = watch('show_for_users');

  useEffect(() => {
    console.log('Show for everyone:', watchShowForEveryone);
  }, [watchShowForEveryone]);

  useEffect(() => {
    console.log('Show for users:', watchShowForUsers);
  }, [watchShowForUsers]);

  const [nonToolbarUsers, setNonToolbarUsers] = useState(
    userEmails.filter((email) => !initialToolbarUsers.includes(email)),
  );

  useEffect(() => {
    setNonToolbarUsers(
      userEmails.filter((email) => !watchShowForUsers.includes(email)),
    );
  }, [userEmails, watchShowForUsers]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
      <CardContent>
        <Form {...form}>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='show_for_everyone'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>Show for everyone</FormLabel>
                    <FormDescription className='whitespace-pre-wrap max-w-md'>
                      If enabled the toolbar will be visible to all visitors to
                      the site.
                      {'\n'}
                      Otherwise the toolbar will only be visible to users listed
                      below.
                      {'\n'}
                      {'\n'}
                      <span className='font-semibold text-sm inline'>
                        Note:
                      </span>
                      This option is not recommended unless you are testing
                      fetures that require the user to be logged out.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='show_for_users'
              render={({ field }) => (
                <FormItem className='flex flex-col items-start justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>Show for specific users</FormLabel>
                    <FormDescription className='whitespace-pre-wrap'>
                      Choose users belowwho should be the toolbar when they are
                      logged in.
                      {'\n'}
                      Only applies if &quot;Show for everyone&quot; is disabled.
                    </FormDescription>
                  </div>
                  <div className='flex flex-col'>
                    {field.value.map((email) => (
                      <Badge
                        key={email}
                        variant='outline'
                        className='mr-2 mb-2 p-0 px-3 pr-1 gap-1'
                      >
                        {email}
                        <Button
                          variant='ghost'
                          size='sm'
                          className='rounded-full p-0 aspect-square text-red-400 hover:bg-inherit hover:text-red-700'
                          type='button'
                          onClick={() => {
                            field.onChange(
                              watchShowForUsers.filter(
                                (prevEmail) => prevEmail !== email,
                              ),
                            );
                          }}
                        >
                          <XIcon className='h-3 w-3' />
                        </Button>
                      </Badge>
                    ))}
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className='w-[200px] justify-between text-muted-foreground'
                          >
                            Add user
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-[200px] p-0'>
                        <Command>
                          <CommandInput
                            placeholder='Search users...'
                            className='h-9'
                          />
                          <CommandList>
                            <CommandEmpty>No user found.</CommandEmpty>
                            <CommandGroup>
                              {nonToolbarUsers.map((option) => (
                                <CommandItem
                                  value={option}
                                  key={option}
                                  onSelect={() => {
                                    field.onChange([...field.value, option]);
                                  }}
                                >
                                  {option}
                                  {/* <CheckIcon className='ml-auto h-4 w-4' /> */}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </Form>
      </CardContent>
      <CardFooter className='justify-end'>
        <SubmitButton />
      </CardFooter>
    </form>
  );
};

export default ToolbarSettingsForm;
