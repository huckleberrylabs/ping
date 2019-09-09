import { NowRequest, NowResponse } from "@now/node";
import {
  UUID,
  Result,
  ResultSerializer,
  IEvent,
  IsEvent,
  OK,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  ErrorName,
  IsError,
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
  result.data = serializer(result.data, result.dataType);
  if (IsError(result.status)) {
    res.status(result.status).send(ResultSerializer(result));
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
      event = deserializer<IEvent>(req.body, req.body.type);
      const result = await bus(event);
      result.data = serializer(result.data, result.dataType);
      res.status(result.status).send(ResultSerializer(result));
    } catch (error) {
      if (IsEvent(event)) {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send(
            ResultSerializer(
              Result(
                error.toString,
                ErrorName,
                INTERNAL_SERVER_ERROR,
                ORIGIN_ID,
                event.corr,
                event.id
              )
            )
          );
      }
    }
  }

  res.status(NOT_FOUND).send(null);
};
