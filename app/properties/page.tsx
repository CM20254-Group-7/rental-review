import {createClient} from '@/utils/supabase/server'
import { error } from 'console';
import { cookies } from 'next/headers';

export default async function PropertiesPage(){
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const{ data:properties, error: propertiesError } = await supabase
        .from('properties')
        .select('address')

    if ( propertiesError ) {
        return(
            <div>
                <main>
                    There is an error with the properties database.
                </main>
            </div>
        )
    }

    return(
        <div>
            <div>
                <h1>Profile Page</h1>
            </div>
            <div>
                <form
                className="animate-in flex-1 flex flex-col w-full justify-center gap-1 text-foreground">
                    <input className="mt-5 rounded-md px-4 py-2 bg-inherit border mb-1" 
                    name="address" 
                    placeholder="13 Argyle Terrace, Staverton, Bath, BA2 3DF..."/>
                    <button className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-5">
                        Search (no functionality yet)
                    </button>
                </form>
            </div>
            <div>
                <main>
                    <ul>
                        {properties?.map((p) => {
                            return (
                                <li>{p.address}</li>
                            )
                        })}
                    </ul>
                </main>
            </div>
        </div>
    )
}