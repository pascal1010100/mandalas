import { clsx, type ClassValue } from "clsx"
// Utility functions for class merging and currency formatting
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


