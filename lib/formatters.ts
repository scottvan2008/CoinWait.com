// Format large numbers with commas
export const formatNumber = (num: number, decimals = 2) => {
    // For very large numbers (over 1 million), format using abbreviations on smaller screens
    if (num > 1000000) {
        // Convert to K, M, B, T format
        const tiers = ["", "K", "M", "B", "T"];
        const tier = Math.floor(Math.log10(num) / 3);
        const scale = Math.pow(10, tier * 3);
        const scaled = num / scale;

        return (
            scaled.toLocaleString("en-US", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            }) + tiers[tier]
        );
    }

    // For smaller numbers, use the regular formatting
    return num.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

// Format currency
export const formatCurrency = (amount: number, decimals = 2) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(amount);
};

// Format date
export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
        date.getSeconds()
    ).padStart(2, "0")}`;
};
