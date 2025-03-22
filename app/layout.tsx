import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "CoinWait - Bitcoin Halving Tracker",
    description:
        "Track the Bitcoin halving countdown and statistics in real-time",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navigation />
                    <div className="min-h-screen pb-16 md:pb-0">{children}</div>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
