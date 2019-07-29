export function sliceBySubStrings(
  string: string,
  subString1: string,
  subString2?: string
): string {
  if (typeof subString2 !== "undefined") {
    return string.slice(
      string.indexOf(subString1) + subString1.length,
      string.indexOf(subString2)
    );
  }
  return string.slice(string.indexOf(subString1) + subString1.length);
}
