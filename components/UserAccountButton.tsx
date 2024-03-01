import Link from "next/link";

export default function UserAccountButton(){
    return(
        <div>
            <Link 
            href="/account" 
            className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                User Mangement
            </Link>
        </div>
    )
}