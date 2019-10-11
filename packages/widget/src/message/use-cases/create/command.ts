import * as iots from "io-ts";
import { Type, UUID } from "@huckleberryai/core";
import { MessageEvent, MessageEventCodec } from "../base";

export const CommandType = "widget:command:create-message" as Type;

export const CommandCodec = MessageEventCodec;

export type Command = iots.TypeOf<typeof CommandCodec>;

export const Command: (
  message: UUID,
  widget: UUID,
  corr?: UUID,
  parent?: UUID
) => Command = MessageEvent(CommandType);
