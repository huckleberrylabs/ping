import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import * as NameSpaceCaseString from "../namespace-case-string";
import * as Errors from "../errors";
import { DecodeErrorFormatter } from "../../logging";

export {
  OK, // 200
  BAD_REQUEST,
  UNAUTHORIZED, // 401
  FORBIDDEN, // 403
  NOT_FOUND, // 404
  METHOD_NOT_ALLOWED, // 405
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
    iots.literal(405),
    iots.literal(500),
  ],
  Name
);
export const Decode = (value: unknown) =>
  fold<iots.Errors, T, Either<Errors.Validation.T, T>>(
    errors =>
      left(
        Errors.Validation.C(Name, `Decode: ${DecodeErrorFormatter(errors)}`)
      ),
    decoded => right(decoded)
  )(Codec.decode(value));
export const Encode = Codec.encode;
export const Is = Codec.is;
export const IsSuccess = (input: T): boolean => input <= 299 && input >= 200;
export const IsError = (input: T): boolean => !IsSuccess(input);
export type T = iots.TypeOf<typeof Codec>;
