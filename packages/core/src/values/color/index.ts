import ColorLib from "color";
import { IsNonEmptyString } from "../non-empty-string";

export type Color = string;

export const IsValidColor = (input: string): input is Color => {
  try {
    ColorLib(input, "hex");
    return true;
  } catch (error) {
    return false;
  }
};

export const IsColor = (input: unknown): input is Color =>
  IsNonEmptyString(input) && IsValidColor(input);
