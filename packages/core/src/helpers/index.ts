import { TypeName } from "../value-objects/type-name";
export const ErrorName = TypeName("Error");

export const IsNonNullObject = (input: unknown): input is object => {
  // Must be non-null
  if (!input || input === null) {
    return false;
  }
  // Must be Object
  if (typeof input !== "object") {
    return false;
  }
  return true;
};
