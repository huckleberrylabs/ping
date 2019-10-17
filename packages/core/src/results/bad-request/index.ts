import * as iots from "io-ts";
import * as Event from "../../event";
import * as Base from "../../result";
import { Type, StatusCode } from "../../values";

export const Name = "core:result:bad-request" as Type.T;

export const Codec = Base.Codec;

export type T = iots.TypeOf<typeof Codec>;

export const C = (event: Event.T) =>
  Base.C(Name)(StatusCode.BAD_REQUEST)(event);

export const Is = Codec.is;
