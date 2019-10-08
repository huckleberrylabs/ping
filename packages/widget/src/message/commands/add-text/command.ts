import * as iots from "io-ts";
import { pipe } from "fp-ts/lib/pipeable";
import { map, Either, right, left, flatten } from "fp-ts/lib/Either";
import { UUID, Type } from "@huckleberryai/core";
import { WidgetEvent, WidgetEventCodec } from "../../../base/event";
import { ValidationError } from "../../../../../core/lib/errors";

export const WidgetAddTextToMessageCommandType = "widget:command:add-text-to-message" as Type;

export const WidgetAddTextToMessageCommandCodec = iots.intersection(
  [
    WidgetEventCodec,
    iots.type({
      message: NonEmptyString,
    }),
  ],
  WidgetAddTextToMessageCommandType
);

export type WidgetAddNameToMessageCommand = iots.TypeOf<
  typeof WidgetAddTextToMessageCommandCodec
>;

export const WidgetAddTextToMessageCommand = (
  message: string,
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): Either<Error, WidgetAddNameToMessageCommand> =>
  pipe(
    WidgetEvent(WidgetAddTextToMessageCommandType)(
      widget,
      origin,
      corr,
      parent,
      agent
    ),
    map(event =>
      NonEmptyString.is(message)
        ? right({ ...event, message })
        : left(new ValidationError("message cannot be empty"))
    ),
    flatten
  );
