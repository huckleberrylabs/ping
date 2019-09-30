import { NowRequest } from "@now/node";
import { UUID, IsUUID, IEvent, Event, IsEvent } from "@huckleberryai/core";
import { IncomingHttpHeaders } from "http2";

export interface IHTTPAccessEvent extends IEvent {
  method: string | null;
  url: string | null;
  headers: IncomingHttpHeaders;
}

export const HTTPAccessEventType = "http-access-event";

export const HTTPAccessEvent = (
  req: NowRequest,
  origin: UUID
): IHTTPAccessEvent => {
  const corrString = req.query["corr_id"];
  const corr = IsUUID(corrString) ? corrString : undefined;
  const parentString = req.query["parent_id"];
  let parent = IsUUID(parentString) ? parentString : undefined;
  const event = Event(HTTPAccessEventType, origin, corr, parent);
  return {
    ...event,
    method: req.method ? req.method : null,
    url: req.url ? req.url : null,
    headers: req.headers,
  };
};

const HasHTTPAccessEventShape = (input: object): boolean => {
  const hasMethod = "method" in input;
  const hasURL = "url" in input;
  const hasHeaders = "headers" in input;
  return hasMethod && hasURL && hasHeaders;
};

export const IsHTTPAccessEvent = (input: unknown): input is IHTTPAccessEvent =>
  IsEvent(input) &&
  input.type === HTTPAccessEventType &&
  HasHTTPAccessEventShape(input); // todo: replace with more specific validation
