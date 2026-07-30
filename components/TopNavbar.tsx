"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileMini from "./ProfileMini";

const NAV_ITEMS = [
    { href: "/dashboard", label: "امروز" },
    { href: "/calendar", label: "تقویم" },
    { href: "/weekly-plan", label: "هفته" },
    { href: "/monthly-plan", label: "ماه" },
];

export default function TopNavbar() {
    const pathname = usePathname();

    return (
        <header className="border-b border-line bg-paper/90 backdrop-blur">
            <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4">
                <h1 className="hidden font-display text-lg font-bold text-ink sm:block">
                    بولت ژورنال من
                </h1>

                <nav className="flex flex-1 gap-1 overflow-x-auto sm:flex-none sm:justify-center">
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition ${active ? "bg-ink text-paper" : "text-ink-light hover:bg-ink/5 hover:text-ink"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <ProfileMini />
            </div>
        </header>
    );
}