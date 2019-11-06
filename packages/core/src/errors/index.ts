import * as iots from "io-ts";
import * as Adapter from "./adapter";
import * as Environment from "./environment";
import * as Forbidden from "./forbidden";
import * as NotFound from "./not-found";
import * as Parsing from "./parsing";
import * as Unauthenticated from "./unauthenticated";
import * as Unauthorized from "./unauthorized";
import * as Validation from "./validation";

export type T =
  | Adapter.T
  | Environment.T
  | Forbidden.T
  | NotFound.T
  | Parsing.T
  | Unauthenticated.T
  | Unauthorized.T
  | Validation.T;

export type Names =
  | typeof Adapter.Name
  | typeof Environment.Name
  | typeof Forbidden.Name
  | typeof NotFound.Name
  | typeof Parsing.Name
  | typeof Unauthenticated.Name
  | typeof Unauthorized.Name
  | typeof Validation.Name;

export const Codecs = new Map<Names, iots.Mixed>([
  [Adapter.Name, Adapter.Codec],
  [Environment.Name, Environment.Codec],
  [Forbidden.Name, Forbidden.Codec],
  [NotFound.Name, NotFound.Codec],
  [Parsing.Name, Parsing.Codec],
  [Unauthenticated.Name, Unauthenticated.Codec],
  [Unauthorized.Name, Unauthorized.Codec],
  [Validation.Name, Validation.Codec],
]);

export const Is = (input: unknown): input is T =>
  Adapter.Is(input) ||
  Environment.Is(input) ||
  NotFound.Is(input) ||
  Forbidden.Is(input) ||
  Parsing.Is(input) ||
  Unauthenticated.Is(input) ||
  Unauthorized.Is(input) ||
  Validation.Is(input);

export {
  Adapter,
  Environment,
  NotFound,
  Forbidden,
  Parsing,
  Unauthenticated,
  Unauthorized,
  Validation,
};
