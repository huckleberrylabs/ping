export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}

export function log(input: any): void {
  console.log("Turtle Text: ", input);
}

export function getElementById(id: string) {
  const element = document.getElementById(id);
  if (element) {
    return element;
  }
  throw new Error(`Element with ID ${id} not found`);
}

export function setAttributeById(
  id: string,
  attribute: string,
  value: string
): void {
  const element = getElementById(id);
  element.setAttribute(attribute, value);
}

export function getAttributeById(id: string, attribute: string) {
  const element = getElementById(id);
  return element.getAttribute(attribute);
}
