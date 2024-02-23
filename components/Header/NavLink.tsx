'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const NavLink: React.FC<{
    text: string;
    href: string;
}> = ({ text, href }) => {
    const pathName = usePathname();
    const [active, setActive] = useState(pathName === href);

    useEffect(() => {
        console.log(pathName, href);
        setActive(pathName === href);
    }, [pathName]);

    return (
        <div>
            <Link
                href={href}
                className={`py-1 px-2 flex rounded-b-md no-underline bg-btn-background hover:bg-btn-background-hover ${active ? 'border-b border-accent' : 'hover:border-b hover:border-accent/70'}`}
            >
                {text}
            </Link>
        </div>
    )
}