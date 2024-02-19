'use client'

import { useFormState } from "react-dom"
import claimProperty from "./actions"

interface ClaimPropertyFormProps {
    property_id: string
    landlord_id: string
}

export const ClaimPropertyForm: React.FC<ClaimPropertyFormProps> = ({
    property_id,
    landlord_id
}) => {
    const claimPropertyWithIds = claimProperty.bind(null, property_id, landlord_id)
    const initialState = { errors: {}, message: null }
    const [state, dispatch] = useFormState(claimPropertyWithIds, initialState)

    return (
        <div
            className="flex flex-col"
        >
            <div className="flex flex-col gap-2 justify-center bg-foreground/20 border rounded-t-lg p-4">
                <div className="flex flex-row gap-2 items-baseline">
                    <label
                        className="text-lg font-bold"
                        htmlFor="property_id"
                    >Property Id:</label>
                    <p className="text-md">{property_id}</p>
                </div>

                <div className="flex flex-row gap-2 items-baseline">
                    <label
                        className="text-lg font-bold"
                        htmlFor="landlord_id"
                    >Landlord Id:</label>
                    <p className="text-md">{landlord_id}</p>
                </div>
            </div>

            <form 
                className="flex flex-col gap-4 justify-center bg-foreground/10 border-x px-4 py-8"
                action={dispatch}
            >
                <div className="flex flex-col gap-1 justify-center">
                    <label
                        className="text-lg font-bold"
                        htmlFor="started_at"
                    >Start Date:</label>
                    <input
                        className="bg-transparent  hover:bg-foreground/5 border border-foreground/50 rounded-md px-2 py-1"
                        type="date"
                        name="started_at"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1 justify-center">
                    <label
                        className="text-lg font-bold"
                        htmlFor="ended_at"
                    >End Date:</label>
                    <input
                        className="bg-transparent  hover:bg-foreground/5 border border-foreground/50 rounded-md px-2 py-1"
                        type="date"
                        name="ended_at"
                    />
                </div>

                <div />

                <button
                    className="bg-foreground/20 active:bg-forground/10 hover:bg-foreground/10 border border-foreground/50 font-bold rounded-md p-2"
                    type="submit"
                >Claim Property</button>
            </form>

            <div className="flex flex-col gap-2 justify-center bg-foreground/20 border rounded-b-lg p-4">
                <pre>{JSON.stringify(state, null, '\t')}</pre>
            </div>

        </div>
    )
}