import { NonEmptyString, IsNonEmptyString } from "../non-empty-string";

export type KebabCaseString = NonEmptyString;

export const IsKebabCaseString = (input: unknown): input is KebabCaseString =>
  IsNonEmptyString(input) && input.match("^([a-z0-9]*)(-[a-z0-9]+)*$") !== null;
