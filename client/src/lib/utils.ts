import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Date utility functions for handling ISO string to YYYY-MM-DD conversion
 * Critical for Edit Task dialogs where API returns ISO dates but HTML inputs expect YYYY-MM-DD
 */

/**
 * Converts ISO date string to YYYY-MM-DD format for HTML date inputs
 * @param isoString - ISO date string (e.g., "2025-07-09T22:01:48.124Z") or null
 * @returns YYYY-MM-DD string or empty string if null
 */
export function formatDateForInput(isoString: string | null | undefined): string {
  if (!isoString) return '';
  return new Date(isoString).toISOString().split('T')[0];
}

/**
 * Converts YYYY-MM-DD date string to ISO string for API calls
 * @param dateString - YYYY-MM-DD string from HTML date input or null
 * @returns ISO date string or null
 */
export function formatDateForAPI(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  return new Date(dateString).toISOString();
}

/**
 * Formats ISO date string for display with optional formatting
 * @param isoString - ISO date string or null
 * @param format - Optional format ('short' for MMM D, 'full' for MMM D, YYYY)
 * @returns Formatted date string or empty string if null
 */
export function formatDateForDisplay(isoString: string | null | undefined, format: 'short' | 'full' = 'short'): string {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = format === 'short' 
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' };
    
  return date.toLocaleDateString('en-US', options);
}
