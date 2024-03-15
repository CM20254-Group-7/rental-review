import { NextPage } from 'next';
import CreateReviewForm from './form';

const CreateReviewPage: NextPage<{
  params: {
    id: string;
  };
}> = ({ params: { id: propertyId } }) => (
  <div>
    <h1 className='text-2xl font-bold mt-6'>Create Review for existing property</h1>
    <p className='mb-6'>Write your review for this property</p>

    <CreateReviewForm
      propertyId={propertyId}
    />
  </div>
);

export default CreateReviewPage;
