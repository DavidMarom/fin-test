export function birthYear(dob: string): number {
  return new Date(dob).getFullYear();
}
