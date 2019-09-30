export type NonNullObject = {
  [key: string]: unknown;
};

export const IsNonNullObject = (input: unknown): input is NonNullObject =>
  typeof input === "object" && input !== null;
