
/**
 * Checks if a date is close to expiration within the specified number of months
 * @param date The date to check
 * @param months The number of months to check against
 * @returns true if the date expires within the specified number of months
 */
export function isDateCloseToExpiration(date: Date, months: number): boolean {
  const currentDate = new Date();
  const expirationThreshold = new Date();
  expirationThreshold.setMonth(currentDate.getMonth() + months);
  
  return date <= expirationThreshold && date >= currentDate;
}

/**
 * Format a date to a short date string
 * @param date The date to format
 * @returns The formatted date string
 */
export function formatShortDate(date: Date | string | null): string {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString();
  } catch (error) {
    return 'Invalid Date';
  }
}
