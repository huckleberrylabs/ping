import uuid from "uuid/v4";
import { IsKebabCaseString } from "../kebab-case-string";

export type UUID = string;

export const UUID = () => uuid();

export const IsUUID = (input: unknown): input is UUID =>
  IsKebabCaseString(input) && input.length === 36;
