import { pipe } from "fp-ts/lib/pipeable";
import { none, some } from "fp-ts/lib/Option";
import * as iots from "io-ts";
import {
  Event as Base,
  UUID,
  Type,
  optionFromNullable,
} from "@huckleberryai/core";

export const Codec = iots.intersection([
  Base.Codec,
  iots.type({
    app: optionFromNullable(UUID.Codec),
  }),
]);

export type T = iots.TypeOf<typeof Codec>;

export const C = (type: Type.T) => (
  app?: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
): T =>
  pipe(
    Base.C(type, corr, parent),
    event => ({ ...event, app: app ? some(app) : none })
  );
