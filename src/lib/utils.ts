import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Essa função une classes condiciionais e resolve conflitos do Tailwind
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}