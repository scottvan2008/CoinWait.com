"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export function Header() {
    return (
        <header className="bg-white dark:bg-gray-900 border-b shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Logo />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
