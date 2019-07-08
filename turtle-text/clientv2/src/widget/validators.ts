export function normalizePhone(input: any): string | null {
  if (validateString(input)) {
    const phone = input.match(/\d/g);
    if (phone) {
      return phone.join("");
    }
    return null;
  }
  return null;
}

export function validatePhone(input: any): boolean {
  if (validateString(input)) {
    const phone = normalizePhone(input);
    if (phone) {
      return phone.length === 10;
    }
  }
  return false;
}

export function validateString(input: any): boolean {
  if (input) {
    return typeof input === "string" && input.trim().length > 0;
  }
  return false;
}
