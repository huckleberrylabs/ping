import maps from "@google/maps";

export type PlaceNode = {
  uri: string,
  lat: number,
  lng: number,
  googleMapsURL: string,
  mailingAddress: string,
  address: string,
  locality: string,
  region: string,
  country: string,
  postalCode: string,
};

/* 
- use google api, dont bother with normalizing the sub-strings
- check if google resolves to mailing address too
*/

export const REGION_MAP = {
  alberta: "AB",
  british: "BC",
  manitoba: "MB",
  brunswick: "NB",
  newfoundland: "NL",
  scotia: "NS",
  northwest: "NT",
  nunavut: "NU",
  ontario: "ON",
  edward: "PE",
  quebec: "QU",
  saskatchewan: "SK",
  yukon: "YT",
};
export async function placeToURI(address) {
  const result = await googleMapsClient.geocode({ address }).asPromise();
  return `geo:${result.json.results[0].geometry.location.lat},${
    result.json.results[0].geometry.location.lng
  }`;
}

export function region(string: string): string | void {
  const input = string.trim().toLowerCase();
  let output = input;
  Object.keys(REGION_MAP).forEach(region => {
    if (input.indexOf(region) > -1) {
      output = REGION_MAP[region];
    }
  });
  return output.toUpperCase();
}

const googleMapsClient = maps.createClient({
  key: "AIzaSyB-3QYNkXPfMNaOqKT6d-KUgH0h1d6RxF0",
  Promise: Promise,
});
