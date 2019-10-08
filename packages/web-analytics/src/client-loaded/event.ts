import { pipe } from "fp-ts/lib/pipeable";
import { Option } from "fp-ts/lib/Option";
import { UUID, Event, Type } from "@huckleberryai/core";
import {
  WebAnalyticsClientEvent,
  WebAnalyticsClientEventCodec,
} from "../base/event";
import { Either, map } from "fp-ts/lib/Either";

export const WebAnalyticsClientLoadedEventType = Type(
  "web-analytics-client-loaded-event"
);

export const WebAnalyticsClientLoadedEvent = WebAnalyticsClientEventCodec;

export interface WebAnalyticsClientLoadedEvent
  extends WebAnalyticsClientEvent {}

export const WebAnalyticsClientLoadedEvent = WebAnalyticsClientEvent(
  WebAnalyticsClientLoadedEventType
);
