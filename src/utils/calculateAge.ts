/**
 * Calculates age based on date of birth and a reference date
 * @param dateOfBirth - String date of birth in format YYYY-MM-DD
 * @param eventDate - Optional reference date to calculate age at (defaults to current date)
 * @returns The calculated age in years
 */
export const calculateAge = (dateOfBirth: string, eventDate?: string): number => {
  if (!dateOfBirth) return 0;
  
  const birthDate = new Date(dateOfBirth);
  const compareDate = eventDate ? new Date(eventDate) : new Date();
  
  let age = compareDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = compareDate.getMonth() - birthDate.getMonth();
  
  // If birthday hasn't occurred yet this year, subtract one year
  if (monthDiff < 0 || (monthDiff === 0 && compareDate.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};