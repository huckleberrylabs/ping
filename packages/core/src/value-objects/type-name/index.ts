export type ITypeName = symbol;

export type ISerializedTypeName = string;

export const TypeName = (name: string): ITypeName => {
  if (!IsSerializedTypeName(name)) {
    throw new Error("TypeName Constructor: non-empty string must be provided");
  }
  return Symbol.for(name);
};

export const IsTypeName = (input: unknown): input is ITypeName => {
  // Must be symbol
  if (typeof input !== "symbol") {
    return false;
  }
  // Must exist in global registry
  if (!Symbol.keyFor(input)) {
    return false;
  }
  return true;
};

export const IsSerializedTypeName = (
  input: unknown
): input is ISerializedTypeName => {
  // Must be string
  if (typeof input !== "string") {
    return false;
  }
  // Must be non-empty string
  if (input.trim().length === 0) {
    return false;
  }
  return true;
};

export const TypeNameSerializer = (input: ITypeName): ISerializedTypeName => {
  if (IsTypeName(input)) {
    const typeNameKey = Symbol.keyFor(input);
    if (typeNameKey) {
      return typeNameKey;
    }
  }
  throw new Error("Not a TypeName");
};

export const TypeNameDeserializer = (input: unknown): ITypeName => {
  if (IsSerializedTypeName(input)) {
    return TypeName(input);
  }
  throw new Error("Not a SerializedTypeName");
};
