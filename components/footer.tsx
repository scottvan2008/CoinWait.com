import { Bitcoin, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-6 border-t bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Bitcoin className="h-5 w-5 text-bitcoin mr-2" />
                        <span className="font-medium text-bitcoin-dark dark:text-white">
                            CoinWait
                        </span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        <Link
                            href="mailto:scottvan2008@gmail.com"
                            className="hover:text-bitcoin transition-colors"
                        >
                            scottvan2008@gmail.com
                        </Link>
                    </div>

                    <div className="text-sm text-muted-foreground mt-4 md:mt-0">
                        &copy; {new Date().getFullYear()} CoinWait. All rights
                        reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
