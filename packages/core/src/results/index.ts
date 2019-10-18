import * as BadRequest from "./bad-request";
import * as Error from "./internal-error";
import * as NotFound from "./not-found";
import * as OK from "./ok";
import * as OKWithData from "./ok-with-data";
import { Errors } from "..";
import { Left, Right, left, right } from "fp-ts/lib/Either";

export type T = BadRequest.T | Error.T | NotFound.T | OK.T | OKWithData.T<any>;

export type Name =
  | typeof BadRequest.Name
  | typeof Error.Name
  | typeof NotFound.Name
  | typeof OK.Name
  | typeof OKWithData.Name;

export type Encoder =
  | typeof BadRequest.Codec.encode
  | typeof Error.Codec.encode
  | typeof NotFound.Codec.encode
  | typeof OK.Codec.encode;
// not OKWithData not included, must do manually

export const encoders = new Map<Name, Encoder | null>([
  [BadRequest.Name, BadRequest.Codec.encode],
  [Error.Name, Error.Codec.encode],
  [NotFound.Name, NotFound.Codec.encode],
  [OK.Name, OK.Codec.encode],
  [OKWithData.Name, null],
]);

export const returnValues = new Map<Name, Left<Errors.T> | Right<null> | null>([
  [BadRequest.Name, left(Errors.Validation.C())],
  [Error.Name, left(Errors.Adapter.C())],
  [NotFound.Name, left(Errors.NotFound.C())],
  [OK.Name, right(null)],
  [OKWithData.Name, null],
]);

export { BadRequest, Error, NotFound, OK, OKWithData };
