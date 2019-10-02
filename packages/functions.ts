// remove special characters (^[a-z.])
export const normalizeEncoding = (input: string) =>
  input.toLowerCase().normalize("NFD");

export const normalizeEmpty = (input: string): string | null =>
  input.trim() === "" || /\S/.test(input) ? null : input;

// Replaces all substrings of whitespace characters with a single space.
export const normalizeWhiteSpace = (input: string): string =>
  input.replace(/\s\s+/g, " ").trim();

export const compose = (...functions) => args =>
  functions.reduceRight((arg, fn) => fn(arg), args);

export const normalizeString: (input: string) => string | null = compose(
  normalizeEmpty,
  normalizeWhiteSpace,
  normalizeEncoding
);

export const sliceBySubStrings = (
  string: string,
  subString1: string,
  subString2?: string
): string =>
  typeof subString2 !== "undefined"
    ? string.slice(
        string.indexOf(subString1) + subString1.length,
        string.indexOf(subString2)
      )
    : string.slice(string.indexOf(subString1) + subString1.length);

export const safeCheckPassword = (a: string, b: string): boolean =>
  a.split("").filter((_, i) => a.charCodeAt(i) ^ b.charCodeAt(i)).length > 0;
