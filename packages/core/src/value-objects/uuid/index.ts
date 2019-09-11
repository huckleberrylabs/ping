import uuid from "uuid/v4";
import { TypeName } from "../type-name";

export type IUUID = string;

export type ISerializedUUID = IUUID;

export const LENGTH: number = 36;

export const UUIDName = TypeName("UUID");

/** Accepts 36 character UUID string as input. If no input, generates new UUID. */
export const UUID = (input?: string): IUUID => {
  if (input) {
    if (!IsSerializedUUID(input)) {
      throw new Error(`UUIDConstructor: string is not a valid UUID`);
    }
    return input;
  }
  return uuid();
};

export const IsUUID = (input: unknown): input is IUUID => {
  // Must be string
  if (typeof input !== "string") {
    return false;
  }
  // Must be Length
  if (input.length !== LENGTH) {
    return false;
  }
  return true;
};

export const IsSerializedUUID = IsUUID;

export const UUIDSerializer = (input: IUUID): ISerializedUUID => {
  if (IsUUID(input)) {
    return input;
  }
  throw new Error("UUIDSerializer: not a UUID");
};

export const UUIDDeserializer = (input: unknown): IUUID => {
  if (IsSerializedUUID(input)) {
    return input;
  }
  throw new Error("UUIDDeserializer: not a ISerializedUUID");
};
