import { Mail } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-6 border-t bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <Logo />

                    <div className="flex items-center text-sm text-muted-foreground mt-4 md:mt-0">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="hover:text-bitcoin transition-colors">
                            scottvan2008@gmail.com
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground mt-4 md:mt-0">
                        <Link
                            href="/privacy-policy"
                            className="hover:text-bitcoin transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <div>
                            &copy; {new Date().getFullYear()} CoinWait. All
                            rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
