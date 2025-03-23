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

// Format cryptocurrency prices (with 8 decimals for small values)
export const formatCryptoPrice = (price: number) => {
    // Use 8 decimal places for prices under 0.01
    const decimals = price < 0.01 ? 8 : 2;
    return formatCurrency(price, decimals);
};

// Format date to YYYY-MM-DD HH:MM:SS
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

// Format date to YYYY-MM-DD (short format)
export const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
};
