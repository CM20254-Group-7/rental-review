import AuthButton from "./AuthButton";
import HomeButton from "./HomeButton";
import { NavLink } from "@/components/Header/NavLink";

export default function NavBar() {
    return (
        <nav className="w-full flex-none flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-[614px] md:max-w-[80%] flex items-center p-3 text-sm">
                <HomeButton />
                <div className="flex-1 flex flex-row px-8 gap-4">
                    <NavLink 
                        text="Properties" 
                        href="/properties"
                    />
                    {/* Space for other links here */}
                </div>
                <AuthButton />
            </div>
        </nav>
    )
}
