/* 
All normalization functions operate in the same way.
If the Input is not of the correct type,
they return the input as-is.
*/

// remove special characters (^[a-z.])
function string(input: string) {
  if (typeof input === "string") {
    let string = input.toLowerCase();
    string = string.normalize("NFD");
  }
  return input;
}
// Turns empty strings and undefined into null
function nullifyString(input: string | undefined): string | null {
  if (typeof input === "string") {
    if (input === "") {
      return null;
    } else if (!/\S/.test(input)) {
      return null;
    }
    return input;
  } else if (typeof input === "undefined" || input === null) {
    return null;
  }
  return input;
}
// Turns null or undefined into empty array
// Applies nullify function to array members
function nullifyStringArray(
  input: Array<string | void> | undefined
): Array<string> | null {
  if (Array.isArray(input)) {
    return input.map(nullifyString);
  } else if (typeof input === "undefined" || input === null) {
    return [];
  }
  return input;
}
// Returns unique array if input is array of strings/null
function uniqueStringArray(
  input: Array<string | undefined>
): Array<string | undefined> {
  if (Array.isArray(input)) {
    const isRightFormat =
      input.filter(element => typeof element !== "string" && element !== null)
        .length === 0;
    if (isRightFormat) {
      return [...Set(input).filter(element => typeof element === "string")];
    }
  }
  return input;
}
// Replaces all substrings of whitespace characters with a single space.
function whiteSpace(input: string): string {
  if (typeof input === "string") {
    let string = input;
    string = string.replace(/\s\s+/g, " ");
    string = string.trim();
  }
  return input;
}
