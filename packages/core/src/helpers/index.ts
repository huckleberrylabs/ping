import { IData, ISerializedData } from "../interfaces";

export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}

export const IsNonNullObject = (input: unknown): input is object => {
  // Must be non-null
  if (!input || input === null) {
    return false;
  }
  // Must be Object
  if (typeof input !== "object") {
    return false;
  }
  return true;
};

export const IsData = (input: unknown): input is IData => {
  const type = typeof input;
  return (
    type === "boolean" ||
    type === "number" ||
    type === "string" ||
    type === "symbol" ||
    type === "bigint" ||
    type === "object"
  );
};

/** Determines if Input is valid JSON  */
export const IsSerializedData = (input: unknown): input is ISerializedData => {
  if (
    typeof input === "bigint" ||
    typeof input === "function" ||
    typeof input === "symbol" ||
    typeof input === "undefined"
  ) {
    return false;
  }
  if (
    typeof input === "boolean" ||
    typeof input === "number" ||
    typeof input === "string" ||
    input === null
  ) {
    return true;
  }
  // Array
  if (Array.isArray(input)) {
    for (let index = 0; index < input.length; index++) {
      const element = input[index];
      if (!IsSerializedData(element)) {
        return false;
      }
    }
  }
  // Object
  if (typeof input === "object") {
    const indexedObject = <{ [key: string]: unknown }>input;
    for (const key in indexedObject) {
      if (!IsSerializedData(indexedObject[key])) {
        return false;
      }
    }
  }
  throw new Error("Impossible Type");
};
