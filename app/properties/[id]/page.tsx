
import Image from 'next/image'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { StarRatingLayout } from '@/components/StarRating'
import { ReviewDetailsLayout } from '@/components/ReviewDetails'
import { notFound } from 'next/navigation'
import { NextPage } from 'next'
import { cache } from 'react'

interface PropertyDetails {
    address: string;
    baths: number;
    beds: number;
    country: string;
    county: string | null;
    description: string | null;
    house: string;
    id: string;
    postcode: string;
    property_type: string;
    street: string;
}
const getPropertyDetails = cache(async (propertyId:string) : Promise<PropertyDetails | null> => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single()

    if (error || !data) return null

    return data
})

const PropertyDetailPage: NextPage<{
    params: {
        id: string
    }
}> = async ({ params }) => {
    const  PropertyDetails = await getPropertyDetails(params.id)

    if (!PropertyDetails) notFound()

    return (
        <div className="flex-1 flex flex-col w-full px-8 justify-top items-center gap-2 py-20">
            <div className="flex flex-row w-full px-8 justify-center gap-2">
                <div className='relative w-full max-w-md aspect-[1000/682]'>
                    <Image
                        className='absolute w-full max-w-md rounded-lg'
                        src="/house.jpeg"
                        width={1000}
                        height={682}
                        alt="Image of a house"
                    />
                    <div className='w-full h-full bg-background/40 backdrop-blur flex flex-col place-items-center justify-center'>
                        <p className='text-lg font-semibold text-foreground'>Property Images Coming Soon</p>
                    </div>
                </div>
                <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-top gap-2">
                    <text className='font-bold text-lg'>{PropertyDetails.address}</text>
                    <OwnershipDetails propertyId={PropertyDetails.id} />
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

interface landlordPublicProfile {
    bio: string | null;
    display_email: string;
    display_name: string;
    profile_image_id: string | null;
    type: string;
    user_id: string;
    verified: boolean;
    website: string | null;
}

const getCurrentOwner = cache(async (propertyId: string): Promise<landlordPublicProfile | null> => {
    const supabase = createClient(cookies());

    const { data, error } = await supabase
        .from('property_ownership')
        .select('landlord_public_profiles(*)')
        .eq('property_id', propertyId)
        .is('ended_at', null)
        .maybeSingle()

    if (error || !data || !data.landlord_public_profiles) return null

    return data.landlord_public_profiles
})

const OwnershipDetails: React.FC<{
    propertyId: string
}> = async ({ propertyId }) => {
    const currentLandlord = await getCurrentOwner(propertyId)

    if (!currentLandlord) return (
        <p><label className='inline-block font-semibold'>Owned By:</label> Unknown</p>
    )

    const landlordName = currentLandlord.display_name

    return (
        <p><label className='inline-block font-semibold'>Owned By:</label> {landlordName}</p>
    )
}

export default PropertyDetailPage;