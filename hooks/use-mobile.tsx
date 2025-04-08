"use client";

import { useState, useEffect } from "react";

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Function to check if the screen width is mobile sized
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768); // Consider screens smaller than 768px as mobile
        };

        // Check on mount
        checkIsMobile();

        // Add event listener for window resize
        window.addEventListener("resize", checkIsMobile);

        // Cleanup
        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    return isMobile;
}
