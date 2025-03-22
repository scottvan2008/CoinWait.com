import Image from "next/image";
import Link from "next/link";

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
    return (
        <Link href="/" className={`flex items-center gap-2 ${className}`}>
            <div className="relative h-8 w-8 overflow-hidden">
                <Image
                    src="/logo.png"
                    alt="CoinWait Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                />
            </div>
            {showText && (
                <span className="font-bold text-xl text-bitcoin-dark dark:text-white">
                    CoinWait
                </span>
            )}
        </Link>
    );
}
