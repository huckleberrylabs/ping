type IObject = { [key: string]: any };

export const IsObject = (input: unknown): input is IObject => {
  if (typeof input === "object") {
    return true;
  }
  return false;
};
