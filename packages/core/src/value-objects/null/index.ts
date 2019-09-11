import { TypeName } from "../type-name";

export type INull = null;

export type ISerializedNull = INull;

export const NullName = TypeName("Null");

export const IsNull = (input: unknown): input is null => {
  if (input === null) {
    return true;
  }
  return false;
};

export const IsSerializedNull = IsNull;

export const NullSerializer = (input: INull): ISerializedNull => {
  if (IsNull(input)) {
    return input;
  }
  throw new Error("NullSerializer: not Null");
};

export const NullDeserializer = (input: unknown): INull => {
  if (IsSerializedNull(input)) {
    return input;
  }
  throw new Error("NullDeserializer: not ISerializedNull");
};
