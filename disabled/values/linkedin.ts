/* LinkedInUser

- id
- firstName
- lastName
- maidenName
- phoneticFirstName // for Japs
- phoneticLastName // for Japs
- headline
- location
  - countryCode
  - postalCode
- industryId
- summary.localized.en_US.rawText
- positions
  - id
  - title
  - company
  - companyName
  - description
  - endMonthYear
  - startMonthYear
  - location
    - countryCode
    - postalCo/de
  - locationName
- profilePicture
- lastModified
- vanityName

LinkedInCompany

- id
- name
- universal-name
- email-domains
- company-type
- ticker
- website-url
- industries
- status
- logo-url
- square-logo-url
- blog-rss-url
- twitter-id
- employee-count-range
- specialties
- locations
  - description
  - is-headquarters
  - is-active
  - address
    - street1
    - street2
    - city
    - state
    - postal-code
    - country-code
    - region-code
  - contact-info
    - phone1
    - phone2
    - fax
- num-followers
- end-year
- founded-year
- stock-exchange
- description
 */

export type LinkedInUserData = {
  id: UUID;
  url: URL;
  vanityName: string;
  lastModified: TimeStamp;
};

export type LinkedInCompanyData = {
  id: UUID;
  url: URL;
  universalName: string;
  numFollowers: number;
  lastModified: TimeStamp;
};

export const isLinkedinURL = (input: string): boolean =>
  new URL(input).hostname.indexOf("linkedin") > 0;

export const linkedinProfileIsPerson = (input: string): boolean =>
  new URL(input).pathname.indexOf("/company/") === -1;

export const linkedinProfileIsCompany = (input: string): boolean =>
  new URL(input).pathname.indexOf("/company/") > 0;
