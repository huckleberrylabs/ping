import * as iots from "io-ts";
import {
  UUID,
  TimeStamp,
  NonEmptyString,
  OptionFromNullable,
  PersonName,
  EmailAddress,
} from "@huckleberryai/core";
import * as Widget from "../../widget";
import { Option } from "fp-ts/lib/Option";

export const Name = "ping:account";

export const Codec = iots.type(
  {
    type: iots.literal(Name),
    registeredAt: TimeStamp.Codec,
    id: UUID.Codec,
    name: OptionFromNullable.Codec(NonEmptyString.Codec),
    userName: PersonName.Codec,
    email: EmailAddress.Codec,
    emailVerified: iots.boolean,
    widgets: iots.array(Widget.Codec),
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  userName: PersonName.T,
  email: EmailAddress.T,
  name: Option<NonEmptyString.T>
): T => ({
  type: Name,
  registeredAt: TimeStamp.C(),
  id: UUID.C(),
  name,
  userName,
  email,
  emailVerified: false,
  widgets: [],
});

export const Is = Codec.is;
