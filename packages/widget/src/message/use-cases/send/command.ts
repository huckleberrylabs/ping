import * as iots from "io-ts";
import { Type, UUID } from "@huckleberryai/core";
import { Event as Base } from "../base";

export const Name = "widget:command:send-message" as Type.T;

export const Codec = Base.Codec;

export type T = iots.TypeOf<typeof Codec>;

export const C: (
  message: UUID.T,
  widget: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
) => T = Base.C(Name);

export const Is = Codec.is;
