'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Database } from '@repo/supabase-client-helpers';
import { Badge } from '@/components/ui/badge';

import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ActionMenu from './action-menu';

type BaseReportType = Database['public']['Tables']['review_reports']['Row'];

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ReviewReport = Pick<
  BaseReportType,
  'id' | 'reason' | 'status' | 'reporter_id' | 'review_id' | 'explanation'
>;

const statusColours: {
  [key in ReviewReport['status']]: string;
} = {
  reported: 'bg-yellow-500/40 hover:bg-yellow-500/60',
  accepted: 'bg-red-500/40 hover:bg-yellow-500/60',
  rejected: 'bg-green-500/40 hover:bg-yellow-500/60',
};

export const columns: ColumnDef<ReviewReport>[] = [
  {
    accessorKey: 'id',
  },
  {
    accessorKey: 'review_id',
    header: 'Review ID',
  },
  {
    accessorKey: 'reporter_id',
    header: 'Reporter ID',
  },
  {
    accessorKey: 'explanation',
    header: 'Explanation',
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => (
      <Badge variant='outline'>{row.getValue('reason')}</Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as ReviewReport['status'];
      const colour = statusColours[status];

      return (
        <Badge variant='secondary' className={colour}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const report = row.original;

      return (
        <ActionMenu mode='dropdown' reportId={report.id}>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </ActionMenu>
      );
    },
  },
];
