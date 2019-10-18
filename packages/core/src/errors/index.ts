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

export { Adapter, Environment, NotFound, Forbidden, Parsing, Validation };
