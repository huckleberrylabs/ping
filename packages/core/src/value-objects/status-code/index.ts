export {
  OK, // 200
  BAD_REQUEST,
  UNAUTHORIZED, // 401
  FORBIDDEN, // 403
  NOT_FOUND, // 404
  INTERNAL_SERVER_ERROR, // 500
} from "http-status-codes";

export type StatusCode = 200 | 400 | 401 | 403 | 404 | 500;

export const IsStatusCode = (input: unknown): input is StatusCode =>
  input === 200 ||
  input === 400 ||
  input === 401 ||
  input === 403 ||
  input === 404 ||
  input === 500;
