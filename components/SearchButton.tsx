import Link from "next/link";

export default function SearchButton(){
    return(
        <div>
            <Link 
            href="/properties" 
            className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                Search Properties
            </Link>
        </div>
    )
}