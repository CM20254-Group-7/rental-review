import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers';
import { Suspense, cache } from 'react';
import { setTimeout } from "timers/promises";

export default function PropertiesPage() {
    return (
        <div>
            <SideBar />
            <ul>
                <Suspense fallback={<li>Loading...</li>}>
                    <PropertyResults />
                </Suspense>
            </ul>
        </div>
    )
}

const SideBar: React.FC = () => {
    return (
        <form
            className="animate-in flex-1 flex flex-col w-full justify-center gap-1 text-foreground">
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


    // Fake loading time to test load state
    await setTimeout(1000);

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
            <li>{property.address}</li>
        )
    })
}