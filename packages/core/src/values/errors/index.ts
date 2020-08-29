import { isRight } from "fp-ts/lib/Either";
import * as StatusCode from "../status-code";
import * as Adapter from "./adapter";
import * as Environment from "./environment";
import * as NotFound from "./not-found";
import * as NotImplemented from "./not-implemented";
import * as Unauthenticated from "./unauthenticated";
import * as Unauthorized from "./unauthorized";
import * as Validation from "./validation";

export type T =
  | Adapter.T
  | Environment.T
  | NotFound.T
  | NotImplemented.T
  | Validation.T
  | Unauthenticated.T
  | Unauthorized.T;

export const Is = (input: unknown): input is T =>
  Adapter.Is(input) ||
  Environment.Is(input) ||
  NotFound.Is(input) ||
  NotImplemented.Is(input) ||
  Validation.Is(input) ||
  Unauthenticated.Is(input) ||
  Unauthorized.Is(input);

export {
  Adapter,
  Environment,
  NotFound,
  NotImplemented,
  Unauthenticated,
  Unauthorized,
  Validation,
};

export const FromStatusCode = (status: number, data: any): T => {
  switch (status) {
    // Adapter
    case StatusCode.INTERNAL_SERVER_ERROR:
      const serverError = Adapter.Decode(data);
      if (isRight(serverError)) return serverError.right;
    // NotFound
    case StatusCode.NOT_FOUND:
      const notFound = NotFound.Decode(data);
      if (isRight(notFound)) return notFound.right;
    // NotImplemented
    case StatusCode.METHOD_NOT_ALLOWED:
      const notImplemented = NotImplemented.Decode(data);
      if (isRight(notImplemented)) return notImplemented.right;
    // Validation
    case StatusCode.BAD_REQUEST:
      const badrequest = Validation.Decode(data);
      if (isRight(badrequest)) return badrequest.right;
    // Unauthenticated
    case StatusCode.UNAUTHORIZED:
      const unauthenticated = Unauthenticated.Decode(data);
      if (isRight(unauthenticated)) return unauthenticated.right;
    // Unauthorized
    case StatusCode.FORBIDDEN:
      const unauthorized = Unauthorized.Decode(data);
      if (isRight(unauthorized)) return unauthorized.right;
    // Anything else is by default an Adapter Error
    default:
      return Adapter.C(
        "catch-all error from server response",
        "unexpected server response. please try again later or contact support."
      );
  }
};
