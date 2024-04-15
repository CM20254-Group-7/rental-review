import { NextPage } from 'next';
import React from 'react';
import { parseConnectionString } from '@vercel/edge-config';

import {
  FlagDetails,
  flagValueLabel,
  flags,
  getFeatureFlagDetails,
} from '@repo/feature-flags';

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
import { Form, SubmitButton } from './form';

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
      <Form>
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
      </Form>
    </Card>
  );
};

const FeaturesPage: NextPage = () => (
  <AdminConsolePageLayout title='Features'>
    <div className='flex flex-col gap-2 items-center'>
      <FlagTable />
    </div>
  </AdminConsolePageLayout>
);

export default FeaturesPage;
