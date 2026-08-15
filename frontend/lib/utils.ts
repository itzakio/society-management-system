import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncates a string to the first `count` words.
 * Used to shorten long category titles like "Premium Size (6m x 2m, rectangle)"
 * to just "Premium Size".
 */
export function truncateWords(text: string, count: number = 2): string {
  return text.split(/\s+/).slice(0, count).join(" ");
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
}

// Helper function to get currency symbol
export const getCurrencySymbol = (currency: string | null): string | null => {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    BDT: "৳",
    INR: "₹",
    CAD: "C$",
    AUD: "A$",
  };
  if (!currency) return null;
  return symbols[currency.toUpperCase()] || currency.toUpperCase();
};

// Helper function to format date as "Day, DD Month YYYY"
export const formatOverviewDate = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName}, ${day} ${monthName} ${year}`;
};

// Get current year
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

// Get current date and formatted string for overview sections
export const getCurrentOverviewDate = (): { year: number; formattedDate: string } => {
  const currentDate = new Date();
  return {
    year: currentDate.getFullYear(),
    formattedDate: formatOverviewDate(currentDate),
  };
};
