import * as iots from "io-ts";
import { some, none } from "fp-ts/lib/Option";
import {
  UUID,
  Event,
  OptionFromNullable,
  EmailAddress,
  NonEmptyString,
  PersonName,
} from "@huckleberryai/core";

export const Name = "ping:register-account";

export const Codec = iots.intersection(
  [
    iots.type({
      type: iots.literal(Name),
      userName: PersonName.Codec,
      email: EmailAddress.Codec,
      name: OptionFromNullable.Codec(NonEmptyString.Codec),
    }),
    Event.Codec,
  ],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  email: EmailAddress.T,
  userName: PersonName.T,
  name?: NonEmptyString.T,
  corr?: UUID.T
): T => ({
  ...Event.C(corr),
  type: Name,
  email,
  userName,
  name: name ? some(name) : none,
});

export const Is = Codec.is;
