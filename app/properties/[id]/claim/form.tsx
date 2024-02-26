'use client'

import { useFormState } from "react-dom"
import { claimProperty } from "./actions"
import { use, useEffect, useState } from "react"
import { CheckIcon } from "@heroicons/react/24/solid"

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

    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [stillOwned, setStillOwned] = useState(false)

    useEffect(() => {
        if (stillOwned) setEndDate(null)
    }, [stillOwned])

    useEffect(() => {
        if (endDate) setStillOwned(false)
    }, [endDate])

    return (

        <div className="Contents">
            <form
                className="flex flex-col gap-4 justify-center bg-primary/30 border-x px-4 py-8"
                action={dispatch}
            >
                <div className="flex flex-col gap-1 justify-center">
                    <label
                        className="text-lg font-bold"
                        htmlFor="started_at"
                    >When did you purchase this property?</label>
                    <input
                        className={`${startDate ? 'bg-accent/20 hover:bg-accent/30 border-accent/50' : 'bg-transparent hover:bg-foreground/5 border-foreground/50'} border w-[45%]  rounded-md px-2 py-1`}
                        type="date"
                        name="started_at"
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1 justify-center">
                    <label
                        className="text-lg font-bold"
                        htmlFor="ended_at"
                    >When did you sell this property?</label>
                    <div className="flex flex-row gap-2 items-center justify-between">
                        <input
                            className={`${endDate ? 'bg-accent/20 hover:bg-accent/30 border-accent/50' : 'bg-transparent hover:bg-foreground/5 border-foreground/50'} border w-[45%]  rounded-md px-2 py-1`}
                            type="date"
                            name="ended_at"
                            required={!stillOwned}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                            value={endDate?.toISOString().split('T')[0] ?? ''}
                        />

                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                setStillOwned(!stillOwned)
                            }}
                            type="button"
                            className={`${stillOwned ? 'bg-accent/20 hover:bg-accent/30 border-accent/50' : 'bg-transparent hover:bg-foreground/5 border-foreground/50'} flex flex-row w-[45%] justify-evenly px-2 py-1 border rounded-md align-middle items-center`}
                        >
                            <p className="text-lg">I still own this property</p>
                            <div className="w-5 h-5 relative rounded-md border-4">
                                {stillOwned &&
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} className="w-6 h-6 absolute -left-1 -top-2 stroke-accent">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                }

                            </div>
                        </button>
                    </div>
                </div>

                <div />

                <button
                    className="bg-foreground/20 active:bg-forground/10 hover:bg-foreground/10 border border-foreground/50 font-bold rounded-md p-2"
                    type="submit"
                >Claim Property</button>
            </form>

            <div className="flex flex-col gap-2 justify-center bg-primary/50 border rounded-b-lg p-4">
                <pre>{JSON.stringify(state, null, '\t')}</pre>
            </div>

        </div>
    )
}