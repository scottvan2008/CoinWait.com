// Format large numbers with commas
export const formatNumber = (num: number, decimals = 2) => {
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

// Add this new formatter function for large numbers with abbreviations
export const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + "T"; // Trillion
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + "B"; // Billion
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + "M"; // Million
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + "K"; // Thousand
    }
    return num.toFixed(2);
};
