import * as iots from "io-ts";
import * as BadRequest from "./bad-request";
import * as Forbidden from "./forbidden";
import * as Error from "./internal-error";
import * as NotFound from "./not-found";
import * as OK from "./ok";
import * as OKWithData from "./ok-with-data";
import * as Errors from "../errors";
import { Left, Right, left, right } from "fp-ts/lib/Either";

export type T =
  | BadRequest.T
  | Forbidden.T
  | Error.T
  | NotFound.T
  | OK.T
  | OKWithData.T<any>;

export type Names =
  | typeof BadRequest.Name
  | typeof Forbidden.Name
  | typeof Error.Name
  | typeof NotFound.Name
  | typeof OK.Name
  | typeof OKWithData.Name;

export const Codecs = new Map<Names, iots.Mixed | typeof OKWithData.Codec>([
  [BadRequest.Name, BadRequest.Codec],
  [Forbidden.Name, Forbidden.Codec],
  [Error.Name, Error.Codec],
  [NotFound.Name, NotFound.Codec],
  [OK.Name, OK.Codec],
  [OKWithData.Name, OKWithData.Codec],
]);

export const ReturnValues = new Map<Names, Left<Errors.T> | Right<null> | null>(
  [
    [BadRequest.Name, left(Errors.Validation.C())],
    [Forbidden.Name, left(Errors.Forbidden.C())],
    [Error.Name, left(Errors.Adapter.C())],
    [NotFound.Name, left(Errors.NotFound.C())],
    [OK.Name, right(null)],
    [OKWithData.Name, null],
  ]
);

export { BadRequest, Error, NotFound, Forbidden, OK, OKWithData };
