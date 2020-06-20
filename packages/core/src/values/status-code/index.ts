import * as iots from "io-ts";
import * as NameSpaceCaseString from "../namespace-case-string";
export {
  OK, // 200
  BAD_REQUEST,
  UNAUTHORIZED, // 401
  FORBIDDEN, // 403
  NOT_FOUND, // 404
  INTERNAL_SERVER_ERROR, // 500
} from "http-status-codes";

export const Name = "value:status-code" as NameSpaceCaseString.T;

export const Codec = iots.union(
  [
    iots.literal(200),
    iots.literal(400),
    iots.literal(401),
    iots.literal(403),
    iots.literal(404),
    iots.literal(500),
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const IsSuccess = (input: T): boolean => input <= 299 && input >= 200;

export const IsError = (input: T): boolean => !IsSuccess(input);

export const Is = Codec.is;
