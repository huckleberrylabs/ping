import { TypeName } from "../type-name";

export {
  OK, // 200
  BAD_REQUEST,
  UNAUTHORIZED, // 401
  FORBIDDEN, // 403
  NOT_FOUND, // 404
  INTERNAL_SERVER_ERROR, // 500
} from "http-status-codes";

export const ErrorName = TypeName("Error");

export type IStatusCode = 200 | 400 | 401 | 403 | 404 | 500;

export type ISerializedStatusCode = IStatusCode;

export const IsStatus = (input: unknown): input is IStatusCode => {
  if (
    input === 200 ||
    input === 400 ||
    input === 401 ||
    input === 403 ||
    input === 404 ||
    input === 500
  ) {
    return true;
  }
  return false;
};

export const IsSerializedStatus = IsStatus;

export const IsSuccess = (input: IStatusCode): boolean =>
  input <= 299 && input >= 200;

export const IsError = (input: IStatusCode): boolean => !IsSuccess(input);

/*
type HTTPStatusCodesMap = typeof HTTPStatusCodes;
export type HttpStatusCode = Extract<
  HTTPStatusCodesMap[keyof HTTPStatusCodesMap],
  number
>;
*/
