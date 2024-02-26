import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextPage } from "next"

import { ClaimPropertyForm } from "./form"
import { notFound } from "next/navigation"
import Link from "next/link"

const ClaimPropertyPage: NextPage<{ params: { id: string } }> = async ({ params: { id: propertyId } }) => {
    // Set up the supabase client
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)


    // Check a property with the provided id exists
    const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', propertyId)
        .maybeSingle()

    if (propertyError || !propertyData) notFound()


    // Check the user is logged in
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return <NotLoggedInMessage propertyId={propertyId} />


    // Check that the user has a landlord profile
    // TESTING ONLY: landlord profile table permissions are not set up yet, use service client to fetch data
    const { data: landlordData, error: landlordError } = await supabase
        .from('landlord_private_profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .single()

    if (landlordError) return <NotALandlordMessage />

    const landlordId = landlordData.user_id


    // State is valid, render the form
    return (
        <div className="flex flex-1 flex-col gap-2 justify-center">
            <h1 className="text-xl font-semibold text-center">Claim Property</h1>

            <div
            className="flex flex-col"
        >
            <div className="flex flex-col gap-2 justify-center bg-primary/50 border rounded-t-lg p-4">
                <div className="flex flex-row gap-2 items-baseline">
                    <label
                        className="text-lg font-bold"
                        htmlFor="property_address"
                    >Claiming Property:</label>
                    <p className="text-md">{propertyId}</p>
                </div>

                <div className="flex flex-row gap-2 items-baseline">
                    <label
                        className="text-lg font-bold"
                        htmlFor="landlord_id"
                    >Landlord Id:</label>
                    <p className="text-md">{landlordId}</p>
                </div>
            </div>
            <ClaimPropertyForm
                property_id={propertyId}
                landlord_id={landlordId}
            />
            </div>
        </div>
    )
}

const NotLoggedInMessage: React.FC<{propertyId: string}> = ({propertyId}) =>
    <div className="flex flex-col flex-1 place-items-center justify-center gap-4">
        <p className="text-lg font-semibold">
            You must be logged in to access this page
        </p>
        <Link
            href={`/login?redirect=/properties/${propertyId}/claim`}
            className="text-primary font-semibold underline cursor-pointer"
        >
            Go to Login
        </Link>
    </div>

const NotALandlordMessage: React.FC = () =>
    <div className="flex flex-col flex-1 place-items-center justify-center gap-4">
        <p className="text-lg font-semibold">
            You must be registered as a landlord to access this page
        </p>
        <Link
            href={`/landlord-registration`}
            className="text-primary font-semibold underline cursor-pointer"
        >
            Become a Landlord
        </Link>
    </div>

export default ClaimPropertyPage