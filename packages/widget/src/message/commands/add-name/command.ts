import * as iots from "io-ts";
import { pipe } from "fp-ts/lib/pipeable";
import { map, Either } from "fp-ts/lib/Either";
import { UUID, PersonName, PersonNameCodec, Type } from "@huckleberryai/core";
import { WidgetEvent, WidgetEventCodec } from "../../../base/event";

export const WidgetAddNameToMessageCommandType = "widget:command:add-name-to-message" as Type;

export const WidgetAddNameToMessageCommandCodec = iots.intersection(
  [
    WidgetEventCodec,
    iots.type({
      name: PersonNameCodec,
    }),
  ],
  WidgetAddNameToMessageCommandType
);

export type WidgetAddNameToMessageCommand = iots.TypeOf<
  typeof WidgetAddNameToMessageCommandCodec
>;

export const WidgetAddNameToMessageCommand = (
  name: PersonName,
  widget: UUID,
  origin: Type,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): Either<Error, WidgetAddNameToMessageCommand> =>
  pipe(
    WidgetEvent(WidgetAddNameToMessageCommandType)(
      widget,
      origin,
      corr,
      parent,
      agent
    ),
    map(event => ({ ...event, name }))
  );
