import Link from "next/link";

export default function HomeButton(){
    return(
        <div>
            <Link 
            href="/" 
            className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                <img width="40" height="40" src="/favicon.ico"/>
            </Link>
        </div>
    )
}