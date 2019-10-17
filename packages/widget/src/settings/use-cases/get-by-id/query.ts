import * as iots from "io-ts";
import { Type, UUID } from "@huckleberryai/core";
import { Event as Base } from "../../../base";

export const Name = "widget:query:get-settings-by-id" as Type.T;

export const Codec = Base.Codec;

export type T = iots.TypeOf<typeof Codec>;

export const C: (widget: UUID.T, corr?: UUID.T, parent?: UUID.T) => T = Base.C(
  Name
);
