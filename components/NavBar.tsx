import AuthButton from "./AuthButton";
import HomeButton from "./HomeButton";
import SearchButton from "./SearchButton";

export default function NavBar() {
    return(
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                <HomeButton />
                <SearchButton />
                <AuthButton />
            </div>
        </nav>
    )
}