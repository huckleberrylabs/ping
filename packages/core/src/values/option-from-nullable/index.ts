import { either } from "fp-ts/lib/Either";
import { none, Option, option, some, toNullable } from "fp-ts/lib/Option";
import * as iots from "io-ts";

export const None = iots.strict({
  _tag: iots.literal("None"),
});

export const someLiteral = iots.literal("Some");

export interface OptionC<C extends iots.Mixed>
  extends iots.Type<
    Option<iots.TypeOf<C>>,
    Option<iots.OutputOf<C>>,
    unknown
  > {}

export function o<C extends iots.Mixed>(
  codec: C,
  name: string = `Option<${codec.name}>`
): OptionC<C> {
  return iots.union(
    [
      None,
      iots.strict(
        {
          _tag: someLiteral,
          value: codec,
        },
        `Some<${codec.name}>`
      ),
    ],
    name
  );
}

export interface OptionFromNullableC<C extends iots.Mixed>
  extends iots.Type<Option<iots.TypeOf<C>>, iots.OutputOf<C> | null, unknown> {}

export function optionFromNullable<C extends iots.Mixed>(
  codec: C,
  name: string = `Option<${codec.name}>`
): OptionFromNullableC<C> {
  return new iots.Type(
    name,
    o(codec).is,
    (u, c) =>
      u == null ? iots.success(none) : either.map(codec.validate(u, c), some),
    a => toNullable(option.map(a, codec.encode))
  );
}
