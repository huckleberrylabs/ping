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
  id: string;
  url: string;
  vanityName: string;
  lastModified: string;
};

export type LinkedInCompanyData = {
  id: string;
  url: string;
  universalName: string;
  numFollowers: string;
  lastModified: string;
};

export class LinkedIn {
  url: URL;
  constructor(url: string) {
    const parsedURL = new URL(url);
    if (!parsedURL.hostname.indexOf("linkedin")) {
      throw new Error("Invalid URL");
    }
    this.url = parsedURL;
  }
  isPerson() {
    return this.url.pathname.indexOf("/company/") === -1;
  }
  isCompany() {
    return this.url.pathname.indexOf("/company/") > -1;
  }
}
