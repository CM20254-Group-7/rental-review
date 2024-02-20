import Image from 'next/image'
import { StarRatingLayout } from '@/components/StarRating'
import { ReviewDetailsLayout } from '@/components/ReviewDetails'


export default function Page() {
    return (
        <div className="flex-1 flex flex-col w-full px-8 justify-top gap-2">
            <div className="flex flex-row w-full px-8 justify-center gap-2">
                <Image
                    className='max-w-md rounded-lg'
                    src="/house.jpeg"
                    width={1000}
                    height={682}
                    alt="Image of a house"
                />
                <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-top gap-2">
                    <text className='font-bold text-lg'>1 Lorem Ipsum Road, Oldfield Park</text>
                    <text>Owned by Jane Doe</text>
                    <div className='flex flex-row w-full px-0 justify-start items-center gap-2'>
                        <text>Average rating:</text>
                        <StarRatingLayout rating={4} />
                    </div>
                    
                    <text>This is a description. consequat laboris pariatur deserunt exercitation ut ipsum tempor aliquip consequat in laborum voluptate commodo dolor laborum exercitation do duis duis ex aliqua amet fugiat pariatur laborum ex magna excepteur culpa amet est excepteur eu</text>
                </div>
            </div>
            <div className="flex">
                {Array.from({ length: 3 }).map((_, i) => {
                    return (
                        <ReviewDetailsLayout
                        reviewId="1"
                        reviewerId="1"
                        reviewDate={new Date('01 Jan 1970 00:00:00 GMT')}
                        landlordRating={2}
                        propertyRating={4}
                        reviewMessage="skdjdlksdfjl"
                        />
                    )
                })}
            </div>
        </div>
    )
}