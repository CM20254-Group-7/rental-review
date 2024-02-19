import { createClient } from "@/utils/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js" // TESTING ONLY - REMOVE ME
import { Database } from "@/supabase.types"
import { cookies } from "next/headers"
import { NextPage } from "next"

import { ClaimPropertyForm } from "./form"

const ClaimPropertyPage: NextPage = async ({
    searchParams
}: {
    searchParams?: {
        propertyId?: string,
    }
}) => {

    // Check a property id was provided
    const propertyId = searchParams?.propertyId
    if (!propertyId) return (
        <div>
            <h1>ERROR: No Property Id provided</h1>
        </div>
    )


    // Set up the supabase client
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)


    // Check a property with the provided id exists
    const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', propertyId)
        .maybeSingle()

    if (propertyError || !propertyData) return (
        <div>
            <h1>ERROR: Property not found</h1>
        </div>
    )


    // Check the user is logged in
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return (
        <div>
            <h1>ERROR: User not logged in</h1>
        </div>
    )


    // Check that the user has a landlord profile
    // TESTING ONLY: landlord profile table permissions are not set up yet, use service client to fetch data
    const { data: landlordData, error: landlordError } = await createServiceClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    )
        .from('landlord_private_profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

    const landlordId = landlordData?.user_id
    if (landlordError || !landlordId) return (
        <div>
            <h1>ERROR: User is not registered as a landlord</h1>
        </div>
    )

    
    // State is valid, render the form
    return (
        <div className="flex flex-1 flex-col gap-2 justify-center">
            <h1 className="text-xl font-semibold text-center">Claim Property</h1>
            <ClaimPropertyForm
                property_id={propertyId}
                landlord_id={landlordId}
            />
        </div>
    )
}

export default ClaimPropertyPage