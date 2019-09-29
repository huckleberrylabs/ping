import { IsKebabCaseString } from "../kebab-case-string";

export type Type = string;

export const IsType = (input: unknown): input is Type =>
  IsKebabCaseString(input);
