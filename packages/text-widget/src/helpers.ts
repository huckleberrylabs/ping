/** throws error if id not found */
export function getElementById(id: string) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with ID ${id} not found`);
  }
  return element;
}
