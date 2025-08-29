import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format numbers for Arabic locale with Arabic-Indic numerals
export function formatArabicNumber(value: number, locale: string = 'en'): string {
  if (locale === 'ar') {
    // Convert to Arabic-Indic numerals
    return value.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)])
  }
  return value.toString()
}
