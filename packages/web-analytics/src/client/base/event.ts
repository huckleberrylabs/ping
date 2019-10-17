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
): T => ({ ...Base.C(type, corr, parent), app: app ? some(app) : none });

export const Is = Codec.is;
