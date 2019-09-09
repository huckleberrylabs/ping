export const IsNull = (input: unknown): input is null => {
  if (input === null) {
    return true;
  }
  return false;
};
