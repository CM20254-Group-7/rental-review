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
import { Button } from '@/components/ui/button';

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
      {/* {typeof flagDetails.configValue !== 'undefined' ? (
        <Badge variant='outline'>
          {flagValueLabel(
            flagDetails,
            flagDetails.configValue,
          )?.toLocaleString()}
        </Badge>
      ) : (
        <Badge variant='secondary'>N/A</Badge>
      )} */}
    </TableCell>

    {/* <TableCell className='hidden md:table-cell'>25</TableCell>
    <TableCell className='hidden md:table-cell'>2023-07-12 10:42 AM</TableCell>
    <TableCell>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup='true' size='icon' variant='ghost'>
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell> */}
  </TableRow>
);

const updateFlags = async (formData: FormData) => {
  'use server';

  const newFlagValues = Object.entries(flags).reduce((acc, [name, flag]) => {
    const value = formData.get(name);
    if (value === undefined || value === '') return acc;
    return {
      ...acc,
      [name]:
        flag.options?.find((option) => option.label === value)?.value ?? value,
    };
  }, {});

  try {
    const createEdgeConfig = await fetch(
      `https://api.vercel.com/v1/edge-config/${parseConnectionString(process.env.EDGE_CONFIG!)?.id}/items?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'update',
              key: 'featureFlags',
              value: newFlagValues,
            },
          ],
        }),
      },
    );
    const result = await createEdgeConfig.json();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const FlagTable: React.FC = async () => {
  const flagDetails = await getFeatureFlagDetails();
  const flagList = Object.values(flagDetails);

  return (
    <Card>
      <form className='contents' action={updateFlags}>
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
                {/* <TableHead className='hidden md:table-cell'>Created at</TableHead>
              <TableHead>
                <span className='sr-only'>Actions</span>
              </TableHead> */}
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
          <Button size='sm' variant='default' type='submit'>
            Save Changes
          </Button>
        </CardFooter>
      </form>
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
