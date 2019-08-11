export function validateString(input: any): boolean {
  if (input) {
    return typeof input === "string" && input.trim().length > 0;
  }
  return false;
}
