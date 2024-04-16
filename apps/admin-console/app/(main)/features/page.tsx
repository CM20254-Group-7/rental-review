import { NextPage } from 'next';
import React from 'react';
import { get } from '@vercel/edge-config';

import {
  FlagDetails,
  flagValueLabel,
  getFeatureFlagDetails,
} from '@repo/feature-flags';
import { createServiceSupabaseClient } from '@repo/supabase-client-helpers/server-only';

import AdminConsolePageLayout from '@/components/ui/page-layout';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form as TrackedForm, SubmitButton } from './_components/form-wrapper';
import ToolbarSettingsForm from './_components/toolbar-form';

const FlagRow: React.FC<{
  flagDetails: FlagDetails;
}> = ({ flagDetails }) => (
  <TableRow>
    <TableCell className='font-medium'>{flagDetails.name}</TableCell>
    <TableCell className='max-w-md'>{flagDetails.description}</TableCell>
    <TableCell>
      <Badge variant='outline'>
        {flagValueLabel(
          flagDetails,
          flagDetails.defaultValue,
        )?.toLocaleString()}
      </Badge>
    </TableCell>
    <TableCell>
      <Select
        name={flagDetails.name}
        defaultValue={flagValueLabel(
          flagDetails,
          flagDetails.configValue,
        )?.toLocaleString()}
      >
        <SelectTrigger className='w-[10rem]'>
          <SelectValue placeholder='Set config value' />
        </SelectTrigger>
        <SelectContent>
          {flagDetails.options?.map((option) => (
            <SelectItem key={option.label} value={option.label!}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  </TableRow>
);

const FlagTable: React.FC = async () => {
  const flagDetails = await getFeatureFlagDetails();
  const flagList = Object.values(flagDetails);

  return (
    <Card>
      <TrackedForm>
        <CardHeader>
          <CardTitle>Flags</CardTitle>
          <CardDescription>
            Manage feature flags and their default values here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Default Value</TableHead>
                <TableHead>Edge Config</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flagList.map((flag) => (
                <FlagRow key={flag.name} flagDetails={flag} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className='justify-end'>
          <SubmitButton />
        </CardFooter>
      </TrackedForm>
    </Card>
  );
};

const ToolbarSettings: React.FC = async () => {
  const supabase = createServiceSupabaseClient();
  const userList = await supabase.auth.admin.listUsers();

  const configAlwaysShowToolbar = (await get(
    'toolbarAlwaysVisible',
  )) as boolean;
  const configToolbarUsers = await get('toolbarUsers').then((users) =>
    Array.isArray(users) ? users.map((user) => user as string) : [],
  );

  const userEmails = userList.data.users.flatMap((user) => user.email ?? []);
  const toolbarUsers = userEmails.filter((email) =>
    configToolbarUsers.includes(email),
  );

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Toolbar</CardTitle>
        <CardDescription className=' whitespace-pre-wrap'>
          Manage the visibility of the vercel toolbar on production deployments
          here.
          {'\n'}
          The toolbar allows local overrides for feature flags to be set.
        </CardDescription>
      </CardHeader>
      <ToolbarSettingsForm
        alwaysShowToolbar={configAlwaysShowToolbar}
        userEmails={userEmails}
        toolbarUsers={toolbarUsers}
      />
    </Card>
  );
};

const FeaturesPage: NextPage = () => (
  <AdminConsolePageLayout title='Features'>
    <div className='flex flex-col gap-2 items-center'>
      <FlagTable />
      <ToolbarSettings />
    </div>
  </AdminConsolePageLayout>
);

export default FeaturesPage;
