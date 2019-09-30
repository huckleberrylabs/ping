export type NonEmptyString = string;

export const IsNonEmptyString = (input: unknown): input is NonEmptyString =>
  typeof input === "string" && input.trim().length > 0;
