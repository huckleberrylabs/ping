import * as Adapter from "./adapter";
import * as Environment from "./environment";
import * as Forbidden from "./forbidden";
import * as NotFound from "./not-found";
import * as NotImplemented from "./not-implemented";
import * as Parsing from "./parsing";
import * as Unauthenticated from "./unauthenticated";
import * as Unauthorized from "./unauthorized";
import * as Validation from "./validation";

export type T =
  | Adapter.T
  | Environment.T
  | Forbidden.T
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
  Forbidden.Is(input) ||
  Parsing.Is(input) ||
  Unauthenticated.Is(input) ||
  Unauthorized.Is(input) ||
  Validation.Is(input);

export {
  Adapter,
  Environment,
  NotFound,
  NotImplemented,
  Forbidden,
  Parsing,
  Unauthenticated,
  Unauthorized,
  Validation,
};
