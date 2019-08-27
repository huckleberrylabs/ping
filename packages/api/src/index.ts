import { NowRequest, NowResponse } from "@now/node";
import {
  ID,
  Result,
  IEvent,
  isEvent,
  OK,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "@huckleberryai/core";
import { EVENTS_ENDPOINT } from "@huckleberryai/text";
import { HTTPAccessEvent } from "./events";
import { deserialize } from "./deserializer";
import { bus } from "./event-bus";

export default async (req: NowRequest, res: NowResponse) => {
  const ORIGIN_ID = new ID("c7e384c3-697f-4ccf-a514-d54a452acfac");

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

  const accessEvent = new HTTPAccessEvent(req, ORIGIN_ID);
  const result = await bus.emit(accessEvent);
  if (result.isError) {
    res.status(result.status).send(result);
    return;
  }

  // Routes

  const path = req.url;

  if (path === "/ping") {
    res.status(OK).send(null);
    return;
  }

  if (path === EVENTS_ENDPOINT) {
    let event: IEvent | undefined;
    try {
      event = deserialize<IEvent>(req.body);
      const result = await bus.emit(event);
      res.status(result.status).send(result);
    } catch (error) {
      if (isEvent(event)) {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send(
            new Result(
              error.toString,
              INTERNAL_SERVER_ERROR,
              event.type,
              ORIGIN_ID,
              event.corrID,
              event.id
            )
          );
      }
    }
  }

  res.status(NOT_FOUND).send(null);
};
