import uuid from "uuid/v4";
import { IsKebabCaseString } from "../kebab-case-string";

export type UUID = string;

export const UUID_LENGTH: number = 36;

export const UUID = () => uuid();

export const IsUUID = (input: unknown): boolean =>
  IsKebabCaseString(input) && input.length === UUID_LENGTH;
