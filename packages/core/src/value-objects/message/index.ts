import { TypeName } from "../type-name";

export type IMessage = string;
export type ISerializedMessage = string;

export const MessageName = TypeName("Message");

export const Message = (input: string) => input;

export const IsMessage = (input: unknown): input is IMessage => {
  return typeof input === "string" && input.trim().length > 2;
};

export const IsSerializedMessage: (
  input: unknown
) => input is ISerializedMessage = IsMessage;

export const MessageSerializer = (input: IMessage): ISerializedMessage => {
  if (IsMessage(input)) {
    return input;
  }
  throw new Error("MessageSerializer: not text");
};

export const MessageDeserializer = (input: unknown): IMessage => {
  if (IsSerializedMessage(input)) {
    return input;
  }
  throw new Error("MessageDeserializer: not text");
};
