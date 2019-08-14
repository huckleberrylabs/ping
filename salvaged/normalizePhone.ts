import PhoneNumber from "awesome-phonenumber";

/* 

- Remove all characters except for + and \d
- Auto Detect Area
- Auto Extract Extension
- toE164
- toURI
- toNational
- Validate
- Decide which entity it belongs to

https://www.npmjs.com/package/google-libphonenumber
https://www.npmjs.com/package/libphonenumber-js
https://www.npmjs.com/package/awesome-phonenumber

Enrich
- Carrier
- Line Type
- Location
- Timezone
- SMS Gateway Address
- Owner Name, Age, Email, etc

*/

export type PhoneNumber = {
  id: string; // URI
  number: string;
  region: string;
  type: string;
  carrier: string;
};

export type PhoneExtension = {
  id: string; // URI
  extension: string;
};

export function normalizePhone(
  number: string,
  area: string
): string | undefined {
  number = number.replace(/[^\d+]+/g, "");
  if (number.length < 7) {
    return undefined;
  }
  let phoneNumber = PhoneNumber(number, area);
  if (phoneNumber.isValid()) {
    return phoneNumber.getNumber();
  }
  return undefined;
}
