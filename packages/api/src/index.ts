import { NowRequest, NowResponse } from "@now/node";
import {
  OK,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  MessageName,
  IEvent,
  IsSerializedEvent,
  ResultName,
  Result,
  IsError,
  UUID,
} from "@huckleberryai/core";
import { EVENTS_ENDPOINT } from "@huckleberryai/text";
import { HTTPAccessEvent } from "./events";
import { serializer, deserializer, bus } from "./structural";

export default async (req: NowRequest, res: NowResponse) => {
  const ORIGIN_ID = UUID("c7e384c3-697f-4ccf-a514-d54a452acfac");

  // Options

  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "3600");
    res.status(204).send("");
    return;
  }

  // HTTP Access Filtering

  const accessEvent = HTTPAccessEvent(req, ORIGIN_ID);
  const result = await bus(accessEvent);
  if (IsError(result)) {
    res.status(result.status).send(serializer(result, ResultName));
    return;
  }

  // Routes

  const path = req.url;

  if (path === "/ping") {
    res.status(OK).send(null);
    return;
  }

  if (path === EVENTS_ENDPOINT) {
    const serializedEvent = req.body;

    // is not a serialized event
    if (!IsSerializedEvent(serializedEvent)) {
      res
        .status(BAD_REQUEST)
        .send(
          serializer(
            Result(
              "data provided is not an event",
              MessageName,
              BAD_REQUEST,
              ORIGIN_ID
            ),
            ResultName
          )
        );
      return;
    }
    let event: IEvent | undefined;
    try {
      event = deserializer<IEvent>(serializedEvent, serializedEvent.type);
    } catch (error) {
      // is a serialized event, but not recognized by deserializer
      res
        .status(BAD_REQUEST)
        .send(
          serializer(
            Result(
              error.toString(),
              MessageName,
              BAD_REQUEST,
              ORIGIN_ID,
              serializedEvent.corr,
              serializedEvent.parent ? serializedEvent.parent : undefined
            ),
            ResultName
          )
        );
      return;
    }
    try {
      const result = await bus(event);
      res.status(result.status).send(serializer(result, ResultName));
    } catch (error) {
      // is a serialized event recognized by deserializer, but the bus failed to process it
      res
        .status(INTERNAL_SERVER_ERROR)
        .send(
          serializer(
            Result(
              error.toString(),
              MessageName,
              INTERNAL_SERVER_ERROR,
              ORIGIN_ID,
              serializedEvent.corr,
              serializedEvent.parent ? serializedEvent.parent : undefined
            ),
            ResultName
          )
        );
      return;
    }
  }
  res.status(NOT_FOUND).send(null);
};
