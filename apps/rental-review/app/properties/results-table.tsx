import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ClientTremor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import StarRatingLayout from '@/components/StarRating';
import Link from 'next/link';

const PropertyRow: React.FC<{
  id: string;
  address: string;
  averageRating: number;
  currentLandlordRating: number | null;
}> = ({ id, address, averageRating, currentLandlordRating }) => {
  return (
    <TableRow>
      {/* <TableCell className='hidden sm:table-cell'>
        <Image
          alt='Product image'
          className='aspect-square rounded-md object-cover'
          height='64'
          src='/placeholder.svg'
          width='64'
        />
      </TableCell> */}
      <TableCell className='font-medium'>
        <Link
          href={`/properties/${id}`}
          className='text-foreground/80 hover:text-accent hover:underline'
        >
          {address}
        </Link>
      </TableCell>
      <TableCell>
        <StarRatingLayout rating={averageRating} />
      </TableCell>
      <TableCell>
        {currentLandlordRating ? (
          <StarRatingLayout rating={currentLandlordRating} />
        ) : (
          'N/A'
        )}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup='true' variant='light'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='bg-background p-0'>
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem asChild>
              <Link href={`/properties/${id}`} className='focus:bg-primary/20'>
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/properties/${id}/review`}
                className='focus:bg-primary/20'
              >
                Review
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/properties/${id}/ownership-history`}
                className='focus:bg-primary/20'
              >
                Ownership History
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/properties/${id}/claim`}
                className='focus:bg-primary/20'
              >
                Claim
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

const ResultsTable: React.FC<{
  properties: {
    id: string;
    address: string;
    average_rating: number;
    current_landlord_rating: number | null;
  }[];
}> = ({ properties }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* <TableHead className='hidden w-[100px] sm:table-cell'>
            <span className='sr-only'>Image</span>
          </TableHead> */}
          <TableHead className='text-accent'>Address</TableHead>
          <TableHead className='text-accent'>Average Rating</TableHead>
          <TableHead className='text-accent'>Landlord Rating</TableHead>
          {/* <TableHead>Status</TableHead> */}
          {/* <TableHead className='hidden md:table-cell'>Price</TableHead>
          <TableHead className='hidden md:table-cell'>Total Sales</TableHead>
          <TableHead className='hidden md:table-cell'>Created at</TableHead> */}
          <TableHead>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property) => (
          <PropertyRow
            key={property.address}
            id={property.id}
            address={property.address}
            averageRating={property.average_rating}
            currentLandlordRating={property.current_landlord_rating}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export const ResultsTableSkeleton: React.FC<{ rows: number }> = ({ rows }) => (
  <Table>
    <TableHeader>
      <TableRow>
        {/* <TableHead className='hidden w-[100px] sm:table-cell'>
          <span className='sr-only'>Image</span>
        </TableHead> */}
        <TableHead>Address</TableHead>
        <TableHead>Average Rating</TableHead>
        <TableHead>Landlord Rating</TableHead>
        {/* <TableHead>Status</TableHead> */}
        {/* <TableHead className='hidden md:table-cell'>Price</TableHead>
        <TableHead className='hidden md:table-cell'>Total Sales</TableHead>
        <TableHead className='hidden md:table-cell'>Created at</TableHead> */}
        <TableHead>
          <span className='sr-only'>Actions</span>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array.from({ length: rows }).map((i, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <TableRow key={index}>
          <TableCell>
            <div className='bg-primary/20 h-6 w-80 animate-pulse rounded-md text-transparent' />
          </TableCell>
          <TableCell>
            <div className='bg-primary/20 h-6 w-32 animate-pulse rounded-md' />
          </TableCell>
          <TableCell>
            <div className='bg-primary/20 h-6 w-32 animate-pulse rounded-md' />
          </TableCell>
          <TableCell>
            <div className='bg-primary/20 h-6 w-4 animate-pulse rounded-md' />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ResultsTable;
