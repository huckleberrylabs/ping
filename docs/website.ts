import { Either, left } from "fp-ts/lib/Either";
import {
  UUID,
  NonEmptyString,
  TimeStamp,
  Errors,
  EmailAddress,
  Url,
} from "../../value-objects";

// Event Sourced Entity.
export type Website = {
  id: UUID.T;
  name: NonEmptyString.T;
  domains: Domain[];
  widgets: UUID.T[];
  verifications: WebsiteVerification[];
};

// Event
export type WebsiteVerification = {
  id: UUID.T;
  timestamp: TimeStamp.T;
  urlsVerified: VerifiedURL[];
};

// Value Object
export type VerifiedURL = {
  url: Url.T;
  verified: boolean;
};

// Value Object
export type Domain = string;

/**
 *
 * @param name
 * @param domains
 *
 * Account Method
 * name must be unique across Websites in same aggregate root
 * domains must be unique across all sucessfully Verified Website Domains
 */
export const addWebsite = (
  account: Account,
  name: NonEmptyString.T,
  domains: Domain[]
): Either<Errors.T, Account> => {
  // create Website object
  // addDomain for each in list
  return left(Errors.NotImplemented.C());
};

/**
 *
 * @param website
 *
 * Website Method
 * throttles verifications
 * if the user adds a localhost domain let them know it cant be verified
 * if the domain cannot be accessed let them know it cant be verified
 * if the script is missing from all of up to 10 pages checked let them know it was not found
 * if the script is missing on any of up to 10 pages let them know they should install it on all
 * pages if they want their widgets to work on all pages
 * there should be an inner function that takes a domain and verifies it, a well as many useful
 * utility functions within that
 */
export const verify = (website: Website): Either<Errors.T, Website> => {
  return left(Errors.NotImplemented.C());
};

/**
 *
 * @param website
 * @param domain
 *
 * Website Method
 */
export const removeDomain = (
  website: Website,
  domain: Domain
): Either<Errors.T, Website> => {
  return left(Errors.NotImplemented.C());
};

/**
 *
 * @param website
 * @param domain
 *
 * Website Method
 * must be verified again
 * must be unique across all sucessfully Verified Website Domains
 */
export const addDomain = (
  website: Website,
  domain: Domain
): Either<Errors.T, Website> => {
  return left(Errors.NotImplemented.C());
};

/**
 *
 * @param website
 *
 * Account Method
 * name must be unique across Websites in same aggregate root
 */
export const changeWebsiteName = (
  account: Account,
  website: UUID.T,
  name: NonEmptyString.T
): Either<Errors.T, Account> => {
  return left(Errors.NotImplemented.C());
};

/**
 *
 * @param account
 * @param website
 *
 * Account Method
 * data may or may not have to be deleted corresponding with the Widgets of this Website
 * Website could just be archived, then there is an inactive flag on it
 */
export const removeWebsite = (
  account: Account,
  website: UUID.T
): Either<Errors.T, Account> => {
  return left(Errors.NotImplemented.C());
};

/**
 *
 * @param website
 *
 * not clear where this belongs, maybe in a service
 * emails should be stored somehow for future reference
 */
export const emailInstructions = (
  website: Website,
  email: EmailAddress.T
): Either<Errors.T, null> => {
  return left(Errors.NotImplemented.C());
};

/* 
Adding a Widget

- Once an Website is verified, the user is prompted to create their first widget.
- The user configures the widget with a live preview shown on screen, pressing create when done.
- The user is then asked to check if the widget displays correctly and works, if not to contact support.
*/

/**
 *
 * @param website
 * @param widget
 *
 * Website Method
 *
 * widgets cannot overlap
 *
 */
export const addWidget = (
  website: Website,
  widget: UUID.T
): Either<Errors.T, Website> => {
  return left(Errors.NotImplemented.C());
};

/**
 *
 * @param website
 * @param widget
 *
 * Website Method
 *
 * data may or may not have to be deleted
 * widget could just be archived, then there is an inactive flag on it
 *
 */
export const removeWidget = (
  website: Website,
  widget: UUID.T
): Either<Errors.T, Website> => {
  return left(Errors.NotImplemented.C());
};
