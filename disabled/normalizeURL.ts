import normalizeURL from "normalize-url";
/*

Future Improvements

- replace ip with domain name
- replace http with https
- remove query option
- remove hash option
- intelligent option: check if urls resolve identically
- url aliases
- capitalize letters in escaped sequences
- decode unecessarly encoded characters

https://www.w3.org/International/articles/idn-and-iri/
encodeURIComponent(decodeURIComponent());

*/
export function normalizeURL(input: string): string {
  /* 
    - checks if valid
    - lowercases scheme and host
    - removes default port
  */
  const parsedURL = new URL(input);
  /* 
    - removes trailing slash
    - removes default directory indexes
    - removes www
    - alphabetically sorts query parameters
    - removes utm parameters
  */
  let url = normalizeURL(parsedURL.toString());

  // Remove unecessary question mark
  url = url.endsWith("?") ? url.slice(0, -1) : url;

  return url;
}
