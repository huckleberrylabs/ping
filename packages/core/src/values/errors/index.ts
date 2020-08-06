import * as StatusCode from "../status-code";
import * as Adapter from "./adapter";
import * as Environment from "./environment";
import * as NotFound from "./not-found";
import * as NotImplemented from "./not-implemented";
import * as Parsing from "./parsing";
import * as Unauthenticated from "./unauthenticated";
import * as Unauthorized from "./unauthorized";
import * as Validation from "./validation";
import { isLeft } from "fp-ts/lib/Either";

export type T =
  | Adapter.T
  | Environment.T
  | NotFound.T
  | NotImplemented.T
  | Parsing.T
  | Unauthenticated.T
  | Unauthorized.T
  | Validation.T;

export const Is = (input: unknown): input is T =>
  Adapter.Is(input) ||
  Environment.Is(input) ||
  NotFound.Is(input) ||
  NotImplemented.Is(input) ||
  Parsing.Is(input) ||
  Unauthenticated.Is(input) ||
  Unauthorized.Is(input) ||
  Validation.Is(input);

export {
  Adapter,
  Environment,
  NotFound,
  NotImplemented,
  Parsing,
  Unauthenticated,
  Unauthorized,
  Validation,
};

export const FromStatusCode = (status: number, data: any): T => {
  switch (status) {
    // Adapter
    case StatusCode.INTERNAL_SERVER_ERROR:
      const serverError = Adapter.Codec.decode(data);
      if (isLeft(serverError)) return Adapter.C();
      return serverError.right;
    // NotFound
    case StatusCode.NOT_FOUND:
      const notFound = NotFound.Codec.decode(data);
      if (isLeft(notFound)) return Adapter.C();
      return notFound.right;
    // Parsing
    case StatusCode.BAD_REQUEST:
      const badrequest = Parsing.Codec.decode(data);
      if (isLeft(badrequest)) return Adapter.C();
      return badrequest.right;
    // Unauthenticated
    case StatusCode.UNAUTHORIZED:
      const unauthenticated = Unauthenticated.Codec.decode(data);
      if (isLeft(unauthenticated)) return Adapter.C();
      return unauthenticated.right;
    // Unauthorized
    case StatusCode.FORBIDDEN:
      const unauthorized = Unauthorized.Codec.decode(data);
      if (isLeft(unauthorized)) return Adapter.C();
      return unauthorized.right;
    // Anything else is by default an Adapter Error
    default:
      return Adapter.C();
  }
};
