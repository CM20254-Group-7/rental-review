import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Suspense, cache } from 'react';
import { setTimeout } from "timers/promises";

export default function PropertiesPage() {
    return (
        <div className='flex-1 w-screen flex flex-row'>
            <SideBar />
            <div className='flex w-full justify-center flex-1 py-20'>
                <div className="flex flex-col w-full max-w-prose gap-8 items-center">
                    <Suspense fallback={<PropertyResultsSkeleton />}>
                        <PropertyResults />
                        <div className='flex flex-col items-center gap-2'>
                            <p>Can't see your property?</p>
                            <Link href="/reviews/create">
                                <button className="border border-accent rounded-md px-4 py-2 text-accent mb-5 hover:bg-secondary/10 dark:hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/20">
                                    Review a New Property
                                </button>
                            </Link>
                        </div>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

const SideBar: React.FC = () => {
    return (
        <form
            className="flex flex-col gap-1 text-foreground border-r px-2 py-4"
        >
            <input className="mt-5 rounded-md px-4 py-2 bg-inherit border mb-1"
                name="address"
                placeholder="13 Argyle Terrace, Staverton, Bath, BA2 3DF..." />
            <button className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-5">
                Search (no functionality yet)
            </button>
        </form>
    )
}

const getPropertyResults = cache(async () => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*')

    if (propertiesError) {
        return {
            properties: [],
        }
    }

    return {
        properties,
    }
});

const PropertyResults: React.FC = async () => {
    const { properties } = await getPropertyResults();

    if (properties.length === 0)
        return (
            <div>
                No properties found
            </div>
        )

    return properties.map((property) => {
        return (
            <Link
                className='flex flex-col w-full items-center rounded-xl bg-secondary/10 hover:bg-secondary/20 p-6 pb-8 gap-4 border shadow-md shadow-secondary/40 hover:shadow-lg hover:shadow-secondary/40'
                href={`/properties/${property.id}`}
                key={property.id}
            >
                {/* Card Header */}
                <div className='flex flex-col w-full'>
                    <h2 className="text-2xl font-semibold mb-1 w-fit text-accent">{property.address}</h2>
                    <span className='border border-b w-full border-accent' />
                </div>

                {/* Property Details here */}
                {/* <div className='flex flex-col gap-2'>
                                
                </div> */}
            </Link>
        )
    })
}

const PropertyResultsSkeleton: React.FC = () => {
    // TODO: Replace with skeleton
    return (
        <div className='my-auto' >
            Properties Loading...
        </div>
    )
}