import * as iots from "io-ts";
import { NowRequest } from "@now/node";
import {
  Type,
  Event as BaseEvent,
  EventCodec as BaseEventCodec,
  NonEmptyStringCodec,
  IsUUID,
  optionFromNullable,
} from "@huckleberryai/core";
import { none, some } from "fp-ts/lib/Option";

export const EventType = "web-analytics:event:http-access" as Type;

export const EventCodec = iots.intersection(
  [
    BaseEventCodec,
    iots.type({
      method: optionFromNullable(NonEmptyStringCodec),
      url: optionFromNullable(NonEmptyStringCodec),
      headers: iots.record(
        iots.string,
        iots.union([iots.string, iots.array(iots.string), iots.undefined])
      ),
    }),
  ],
  EventType
);

export type Event = iots.TypeOf<typeof EventCodec>;

export const Event = (req: NowRequest): Event => {
  req.headers;
  const corrString = req.query["corr_id"];
  const corr = IsUUID(corrString) ? corrString : undefined;
  const parentString = req.query["parent_id"];
  let parent = IsUUID(parentString) ? parentString : undefined;
  const event = BaseEvent(EventType, corr, parent);
  return {
    ...event,
    method: NonEmptyStringCodec.is(req.method) ? some(req.method) : none,
    url: NonEmptyStringCodec.is(req.url) ? some(req.url) : none,
    headers: req.headers,
  };
};
