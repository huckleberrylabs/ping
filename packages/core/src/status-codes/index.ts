export {
  OK, // 200
  BAD_REQUEST,
  UNAUTHORIZED, // 401
  FORBIDDEN, // 403
  NOT_FOUND, // 404
  INTERNAL_SERVER_ERROR, // 500
} from "http-status-codes";

export type StatusCode = 200 | 400 | 401 | 403 | 404 | 500;

/*
type HTTPStatusCodesMap = typeof HTTPStatusCodes;
export type HttpStatusCode = Extract<
  HTTPStatusCodesMap[keyof HTTPStatusCodesMap],
  number
>;
*/
