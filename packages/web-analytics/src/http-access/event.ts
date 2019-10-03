import { NowRequest } from "@now/node";
import { UUID, IsUUID, IEvent, Event, IsEvent } from "@huckleberryai/core";
import { IncomingHttpHeaders } from "http2";

export interface IWebAnalyticsHTTPAccessEvent extends IEvent {
  method: string | null;
  url: string | null;
  headers: IncomingHttpHeaders;
}

export const WebAnalyticsHTTPAccessEventType =
  "web-analytics-http-access-event";

export const WebAnalyticsHTTPAccessEvent = (
  req: NowRequest,
  origin: UUID
): IWebAnalyticsHTTPAccessEvent => {
  const corrString = req.query["corr_id"];
  const corr = IsUUID(corrString) ? corrString : undefined;
  const parentString = req.query["parent_id"];
  let parent = IsUUID(parentString) ? parentString : undefined;
  const event = Event(WebAnalyticsHTTPAccessEventType, origin, corr, parent);
  return {
    ...event,
    method: req.method ? req.method : null,
    url: req.url ? req.url : null,
    headers: req.headers,
  };
};

const HasWebAnalyticsHTTPAccessEventShape = (input: object): boolean => {
  const hasMethod = "method" in input;
  const hasURL = "url" in input;
  const hasHeaders = "headers" in input;
  return hasMethod && hasURL && hasHeaders;
};

export const IsWebAnalyticsHTTPAccessEvent = (
  input: unknown
): input is IWebAnalyticsHTTPAccessEvent =>
  IsEvent(input) &&
  input.type === WebAnalyticsHTTPAccessEventType &&
  HasWebAnalyticsHTTPAccessEventShape(input); // todo: replace with more specific validation
