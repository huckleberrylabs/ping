import * as iots from "io-ts";
import {
  TimeStamp,
  NonEmptyString,
  PersonName,
  Phone,
  NameSpaceCaseString,
} from "../../../values";
export const Name = "widget:value:message" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    timestamp: TimeStamp.Codec,
    text: NonEmptyString.Codec,
    phone: Phone.Codec,
    name: PersonName.Codec,
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = Codec.is;
