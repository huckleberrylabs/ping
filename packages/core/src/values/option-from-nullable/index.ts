import { either } from "fp-ts/lib/Either";
import { none, Option, option, some, toNullable } from "fp-ts/lib/Option";
import * as iots from "io-ts";

export const NoneCodec = iots.strict({
  _tag: iots.literal("None"),
});

export interface InnerT<Codec extends iots.Mixed>
  extends iots.Type<
    Option<iots.TypeOf<Codec>>,
    Option<iots.OutputOf<Codec>>,
    unknown
  > {}

export const innerCodec = <Codec extends iots.Mixed>(
  codec: Codec,
  name: string = `Option<${codec.name}>`
): InnerT<Codec> =>
  iots.union(
    [
      NoneCodec,
      iots.strict(
        {
          _tag: iots.literal("Some"),
          value: codec,
        },
        `Some<${codec.name}>`
      ),
    ],
    name
  );

export interface T<Codec extends iots.Mixed>
  extends iots.Type<
    Option<iots.TypeOf<Codec>>,
    iots.OutputOf<Codec> | null,
    unknown
  > {}

export const Codec = <Codec extends iots.Mixed>(
  codec: Codec,
  name: string = `Option<${codec.name}>`
): T<Codec> =>
  new iots.Type(
    name,
    innerCodec(codec).is,
    (u, c) =>
      u == null ? iots.success(none) : either.map(codec.validate(u, c), some),
    a => toNullable(option.map(a, codec.encode))
  );
