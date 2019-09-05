import ColorLib from "color";

export type IColor = ColorLib;
export type ISerializedColor = string;

export const Color = (input: string) => ColorLib(input, "hex");

export const IsColor = (input: unknown): input is IColor => {
  if (input instanceof ColorLib) {
    return true;
  }
  return false;
};

export const IsSerializedColor = (
  input: unknown
): input is ISerializedColor => {
  if (typeof input !== "string") {
    return false;
  }
  try {
    Color(input);
    return true;
  } catch (error) {
    return false;
  }
};

export const ColorSerializer = (input: IColor): ISerializedColor => {
  if (IsColor(input)) {
    return input.toString();
  }
  throw new Error("ColorSerializer: not a Color");
};

export const ColorDeserializer = (input: unknown): IColor => {
  if (IsSerializedColor(input)) {
    return Color(input);
  }
  throw new Error("ColorDeserializer: not a ISerializedColor");
};
