
import { StarIcon } from '@heroicons/react/24/solid'

interface StarRatingProps {
    rating: number
}
export const StarRatingLayout: React.FC<StarRatingProps> = ({
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