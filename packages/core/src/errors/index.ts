import * as iots from "io-ts";
import * as Adapter from "./adapter";
import * as Environment from "./environment";
import * as Forbidden from "./forbidden";
import * as NotFound from "./not-found";
import * as Parsing from "./parsing";
import * as Validation from "./validation";

export type T =
  | Adapter.T
  | Environment.T
  | Forbidden.T
  | NotFound.T
  | Parsing.T
  | Validation.T;

export type Names =
  | typeof Adapter.Name
  | typeof Environment.Name
  | typeof Forbidden.Name
  | typeof NotFound.Name
  | typeof Parsing.Name
  | typeof Validation.Name;

export const Codecs = new Map<Names, iots.Mixed>([
  [Adapter.Name, Adapter.Codec],
  [Environment.Name, Environment.Codec],
  [Forbidden.Name, Forbidden.Codec],
  [NotFound.Name, NotFound.Codec],
  [Parsing.Name, Parsing.Codec],
  [Validation.Name, Validation.Codec],
]);

export { Adapter, Environment, NotFound, Forbidden, Parsing, Validation };
