export function getElementById(id: string) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with ID ${id} not found`);
  }
  return element;
}

export function validateString(input: any): boolean {
  if (input) {
    return typeof input === "string" && input.trim().length > 0;
  }
  return false;
}
