import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextPage } from "next"

const landlordProfilePage: NextPage = async ({
    searchParams
}: {
    searchParams?: {
        landlordId?: string,
    }
}) => {
    // check if a landlord id was provided
    const landlordId = searchParams?.landlordId
    if (!landlordId) return (
        <div>
            <h1>ERROR: No Landlord Id provided</h1>
        </div>
    )

    // set up the supabase client
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // check if a landlord with the provided id exists and get their info
    const { data: landlordData, error: landlordError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', landlordId)
        .single()

    if (landlordError || !landlordData) return (
        <div>
            <h1>ERROR: Landlord profile not found</h1>
        </div>
    )

    // get the properties associated with the landlord and get their info
    const { data: landlordProperties, error: landlordPropertiesError } = await supabase
        .from('property_ownership')
        .select('property_id')
        .eq('landlord_id', landlordId)

    if (landlordPropertiesError) return (
        <div>
            <h1>ERROR: Unable to fetch landlord properties</h1>
        </div>
    ); else if (!landlordProperties) return (
        <div>
            <h1>ERROR: Landlord has no properties</h1>
        </div>
    )
    
    // get the details of each property that the landlord owns
    const { data: propertyDetails, error: propertyDetailsError } = await supabase
        .from('properties')
        .select('address')
        .eq('id', landlordProperties.map(property => property.property_id))

    if (propertyDetailsError || !propertyDetails) return (
        <div>
            <h1>ERROR: Unable to fetch property details</h1>
        </div>
    )

    // check if the user is logged in
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return (
        <div>
            <h1>ERROR: User not logged in</h1>
        </div>
    )

    return (
        <div>
            <h1 style={{ fontSize: "100px" }}>Landlord Profile</h1>
            <p>Name: {landlordData.first_name + ' ' + landlordData.last_name}</p>
            <p>Email: {landlordData.email}</p>
            <p>Created at: {landlordData.created_at}</p>
            {/* CHANGE THIS */}
            <p style={{textAlign: "center", backgroundColor: "red"}}>NEED TO ADD LINK TO THE PROPERTY!!!</p>
            <p>Properties:</p>
            <ul>
                {propertyDetails.map(property => (
                    <li>{property.address}</li>
                ))}
            </ul>
        </div>
    )
}

export default landlordProfilePage