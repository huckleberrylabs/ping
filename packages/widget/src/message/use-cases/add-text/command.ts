import { pipe } from "fp-ts/lib/pipeable";
import * as iots from "io-ts";
import {
  UUID,
  Type,
  NonEmptyStringCodec,
  NonEmptyString,
} from "@huckleberryai/core";
import { MessageEvent, MessageEventCodec } from "../base";

export const CommandType = "widget:command:add-text-to-message" as Type;

export const CommandCodec = iots.intersection(
  [
    MessageEventCodec,
    iots.type({
      text: NonEmptyStringCodec,
    }),
  ],
  CommandType
);

export type Command = iots.TypeOf<typeof CommandCodec>;

export const Command = (
  text: NonEmptyString,
  message: UUID,
  widget: UUID,
  corr?: UUID,
  parent?: UUID
): Command =>
  pipe(
    MessageEvent(CommandType)(message, widget, corr, parent),
    event => ({ ...event, text })
  );
