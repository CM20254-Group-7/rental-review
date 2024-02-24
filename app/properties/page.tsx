import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers';
import { Suspense } from 'react';

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

const PropertyResults: React.FC = async () => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('address')

    if (propertiesError || properties.length === 0) {
        return (
            <div>
                No properties found
            </div>
        )
    }

    return properties?.map((property) => {
        return (
            <li>{property.address}</li>
        )
    })
}