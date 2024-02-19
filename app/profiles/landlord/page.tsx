'use client'

// TEST PAGE FOR CREATE ACTION - PLEASE REPLACE
import { useFormState } from 'react-dom'
import { getLandlordDetails } from "./actions";
// import { createReview } from "./actions";

const landlordProfilePage = () => {

    // For testing only
    const exampleLandlordId = "1"
    const exampleLandlordName = "John Doe"
    const exampleLandlordEmail = "johndoe@gmail.com"
    const exampleLandlordPhone = "123-456-7890"
    const exampleLandLordProperties = ["1234 Example St, Example, EX 12345", "5678 Example St, Example, EX 12345"]

    // get landlord info from the database
    const initialState = { message: null, errors: {} };
    const landlordDetails = getLandlordDetails.bind(null, {id: exampleLandlordId, name: exampleLandlordName, email: exampleLandlordEmail, phone: exampleLandlordPhone, properties: exampleLandLordProperties});

    return (
        // display landlord info using the landlordDetails function
        <div>
            <h1>Landlord Profile</h1>
            <p>Test page for landlord profile action - REPLACE ME</p>
            <p>Name: {exampleLandlordName}</p>
            <p>Email: {exampleLandlordEmail}</p>
            <p>Phone: {exampleLandlordPhone}</p>
            <p>Properties:</p>
            {/* print each property on a new line */}
            {exampleLandLordProperties.map((property) => (
                <p>{property}</p>
            ))}
        </div>
    )
}

export default landlordProfilePage