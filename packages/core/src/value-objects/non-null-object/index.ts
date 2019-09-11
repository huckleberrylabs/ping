import { IsNull } from "../null";
import { IsObject } from "../object";

export const IsNonNullObject = (input: unknown): input is object => {
  if (IsObject(input) && !IsNull(input)) {
    return true;
  }
  return false;
};
