import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReactElement, ReactNode } from 'react';

const SortArrow = ({ direction }: { direction: false | 'asc' | 'desc' }) => {
  if (direction === 'desc') return <ArrowDownIcon className='ml-2 h-4 w-4' />;
  if (direction === 'asc') return <ArrowUpIcon className='ml-2 h-4 w-4' />;
  return <CaretSortIcon className='ml-2 h-4 w-4' />;
};

type filterable =
  | ({ isFilterable: true } & { filterOptions: string[] })
  | ({ isFilterable?: false } & { filterOptions?: never });

type DataTableColumnHeaderProps<TData, TValue> =
  React.HTMLAttributes<HTMLDivElement> & {
    column: Column<TData, TValue>;
    title: string;
    isSortable?: boolean;
    isHideable?: boolean;
  } & filterable;

const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
  className,
  isSortable = false,
  isHideable = false,
  isFilterable = false,
  filterOptions,
}: DataTableColumnHeaderProps<TData, TValue>) => {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const contents: ReactNode[] = [];

  if (isSortable) {
    if (contents.length > 0) {
      contents.push(<DropdownMenuSeparator />);
    }
    contents.push(
      <>
        <DropdownMenuLabel>Sort</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUpIcon className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDownIcon className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
          Desc
        </DropdownMenuItem>
      </>,
    );
  }

  if (isFilterable) {
    if (contents.length > 0) {
      contents.push(<DropdownMenuSeparator />);
    }
    contents.push(
      <>
        <DropdownMenuLabel>Filter</DropdownMenuLabel>
        {filterOptions?.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={column.getFilterValue() === option}
            onCheckedChange={(checked) => {
              column.setFilterValue(checked ? option : undefined);
            }}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </>,
    );
  }

  if (isHideable) {
    if (contents.length > 0) {
      contents.push(<DropdownMenuSeparator />);
    }
    contents.push(
      <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
        <EyeNoneIcon className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
        Hide Column
      </DropdownMenuItem>,
    );
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='data-[state=open]:bg-accent -ml-3 h-8'
          >
            <span>{title}</span>
            {(isSortable || isFilterable || isHideable) && (
              <SortArrow direction={column.getIsSorted()} />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>{contents}</DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DataTableColumnHeader;
