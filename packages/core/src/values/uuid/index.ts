import * as iots from "io-ts";
import { IsKebabCaseString } from "../kebab-case-string";
import uuid from "uuid/v4";

export interface UUIDBrand {
  readonly UUID: unique symbol;
}

export const UUIDCodec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, UUIDBrand> => IsUUID(input),
  "UUID"
);

export type UUID = iots.TypeOf<typeof UUIDCodec>;

export const IsUUID = (input: unknown): input is UUID =>
  IsKebabCaseString(input);

export const UUID = () => uuid() as UUID;
