import { NowRequest } from "@now/node";
import {
  IEvent,
  ISerializedEvent,
  Event,
  EventSerializer,
  EventDeserializer,
  IsEvent,
  IsSerializedEvent,
} from "@huckleberryai/core/src/entities/event";
import { TypeName } from "@huckleberryai/core/src/value-objects/type-name";
import {
  IUUID,
  UUID,
  IsSerializedUUID,
} from "@huckleberryai/core/src/value-objects/uuid";
import { IncomingHttpHeaders } from "http2";

export interface IHTTPAccessEvent extends IEvent {
  method: string | null;
  url: string | null;
  headers: IncomingHttpHeaders;
}

export interface ISerializedHTTPAccessEvent extends ISerializedEvent {
  method: string | null;
  url: string | null;
  headers: IncomingHttpHeaders;
}

export const HTTPAccessEventName = TypeName("HTTPAccessEvent");

const hasAllProperties = (input: object): boolean => {
  const hasMethod = "method" in input;
  const hasURL = "url" in input;
  const hasHeaders = "headers" in input;
  return hasMethod && hasURL && hasHeaders;
};

export const IsHTTPAccessEvent = (
  input: unknown
): input is IHTTPAccessEvent => {
  if (!IsEvent(input)) {
    return false;
  }
  if (!hasAllProperties(input)) {
    return false;
  }
  // TODO: check for correct structure of method, url, headers
  return true;
};

export const IsSerializedHTTPAccessEvent = (
  input: unknown
): input is ISerializedHTTPAccessEvent => {
  if (!IsSerializedEvent(input)) {
    return false;
  }
  if (!hasAllProperties(input)) {
    return false;
  }
  // TODO: check for correct structure of method, url, headers
  return true;
};

export const HTTPAccessEvent = (
  req: NowRequest,
  origin: IUUID
): IHTTPAccessEvent => {
  const corrIDString = req.query["corr_id"];
  let corr = undefined;
  if (IsSerializedUUID(corrIDString)) {
    corr = UUID(corrIDString);
  }
  const parentIDString = req.query["parent_id"];
  let parent = undefined;
  if (IsSerializedUUID(parentIDString)) {
    parent = UUID(parentIDString);
  }
  const event = Event(HTTPAccessEventName, origin, corr, parent);
  return {
    ...event,
    method: req.method ? req.method : null,
    url: req.url ? req.url : null,
    headers: req.headers,
  };
};

export const HTTPAccessEventSerializer = (
  input: IHTTPAccessEvent
): ISerializedHTTPAccessEvent => {
  if (!IsHTTPAccessEvent(input)) {
    throw new Error("HTTPAccessEventSerializer: input is not HTTPAccessEvent");
  }
  const event = EventSerializer(input);
  return {
    ...event,
    method: input.method,
    url: input.url,
    headers: input.headers,
  };
};

export const HTTPAccessEventDeserializer = (
  input: unknown
): IHTTPAccessEvent => {
  if (!IsSerializedHTTPAccessEvent(input)) {
    throw new Error(
      "HTTPAccessEventDeserializer: input is not SerializedHTTPAccessEvent"
    );
  }
  const event = EventDeserializer(input);
  return {
    ...event,
    method: input.method,
    url: input.url,
    headers: input.headers,
  };
};
