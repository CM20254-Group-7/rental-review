'use Server'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import Link from "next/link"

import { StarIcon } from '@heroicons/react/24/solid'

interface ReviewDetailsProps {
    reviewId: string
    link?: boolean
}
export const ReviewDetails: React.FC<ReviewDetailsProps> = async ({
    reviewId,
    link = false
}) => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('review_id', reviewId)
        .single()

    if (error || !data) {
        console.error(error)
        return null
    }

    return <ReviewDetailsLayout
        reviewId={reviewId}
        reviewerId={data.review_id}
        reviewDate={new Date(data.review_date)}
        landlordRating={data.landlord_rating}
        propertyRating={data.property_rating}
        reviewMessage={data.review_body}
        link={link}
    />
}

interface ReviewDetails {
    reviewId: string
    reviewerId: string
    reviewDate: Date
    landlordRating: number
    propertyRating: number
    reviewMessage: string
}

interface ReviewDetailsLayoutProps extends ReviewDetails {
    link?: boolean
}
// export seperately to allow pages that already have the data to use the standardised layout
export const ReviewDetailsLayout: React.FC<ReviewDetailsLayoutProps> = ({
    reviewId,
    reviewerId,
    reviewDate,
    landlordRating,
    propertyRating,
    reviewMessage,
    link = false
}) => {
    return (
        <MaybeLink
            conditionMet={link}
            link={`/review/${reviewId}`}
            className="flex flex-1 flex-col px-8 py-2 sm:px-4 border rounded-lg h-fit w-full max-w-prose justify-center place-items-center"
        >
            {/* <h1>Review Details</h1> */}
            {/* <p>Review ID: {reviewId}</p> */}
            {/* <p>Reviewer ID: {reviewerId}</p> */}
            <div className="flex flex-col w-full sm:w-4/5 gap-2">

                <div className="flex flex-col sm:flex-row justify-around place-items-center">
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold">Property:</p>
                        <StarRating rating={propertyRating} />
                    </div>

                    <div className="flex flex-col">
                        <p className="text-lg font-semibold">Landlord:</p>
                        <StarRating rating={landlordRating} />
                    </div>
                </div>

                <p className="text-lg font-semibold">Review:</p>
                <p className="border rounded-md h-fit min-h-[5rem] bg-gray-100/10 py-1 px-2">{reviewMessage}</p>
                <p className="ml-auto text-gray-300">{reviewDate.toLocaleDateString()}</p>
            </div>
        </MaybeLink>
    )
}


interface MaybeLinkProps {
    conditionMet: boolean
    link: string
    children: React.ReactNode
    className?: string
}
const MaybeLink: React.FC<MaybeLinkProps> = ({
    conditionMet,
    link,
    children,
    className
}) => {
    if (conditionMet) {
        return (
            <Link
                href={link}
                className={className}
            >
                {children}
            </Link>
        )
    }
    return (
        <div className={className}>
            {children}
        </div>
    )
}

interface StarRatingProps {
    rating: number
}
export const StarRating: React.FC<StarRatingProps> = ({
    rating
}) => {
    return (
        <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => {
                const starNumber = i + 1
                const isFilled = starNumber <= rating
                return (
                    <StarIcon
                        key={i}
                        className={`h-10 w-10 ${isFilled ? 'text-yellow-300' : 'text-gray-400'}`}
                    />
                )
            })}
        </div>
    )
}