
import Image from 'next/image'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { StarRatingLayout } from '@/components/StarRating'
import { ReviewDetailsLayout } from '@/components/ReviewDetails'

export default async function Page({ params }: { params: { id: string } }) {

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.id)
        .single()

    return (
        <div className="flex-1 flex flex-col w-full px-8 justify-top items-center gap-2">
            <div className="flex flex-row w-full px-8 justify-center gap-2">
                <Image
                    className='max-w-md rounded-lg'
                    src="/house.jpeg"
                    width={1000}
                    height={682}
                    alt="Image of a house"
                />
                <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-top gap-2">
                    <text className='font-bold text-lg'>{data?.address}</text>
                    <text>Owned by Jane Doe</text>
                    <div className='flex flex-row w-full px-0 justify-start items-center gap-2'>
                        <text>Average rating:</text>
                        <StarRatingLayout rating={4} />
                    </div>
                    
                    <text>This is a description. consequat laboris pariatur deserunt exercitation ut ipsum tempor aliquip consequat in laborum voluptate commodo dolor laborum exercitation do duis duis ex aliqua amet fugiat pariatur laborum ex magna excepteur culpa amet est excepteur eu</text>
                </div>
            </div>

                {Array.from({ length: 3 }).map((_, i) => {
                    return (
                        <ReviewDetailsLayout
                        reviewId="1"
                        reviewerId="1"
                        reviewDate={new Date('01 Jan 1970 00:00:00 GMT')}
                        landlordRating={2}
                        propertyRating={4}
                        reviewMessage="This is a review message"
                        />
                    )
                })}
        </div>
    )
}