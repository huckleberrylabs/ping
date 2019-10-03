import { IoC } from "./ioc"; // must be first import because of inversify & reflect-metadata
import { NowRequest, NowResponse } from "@now/node";
import { Bus } from "./bus";
import {
  OK,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  Result,
  IsError,
  IsEvent,
} from "@huckleberryai/core";
import { EVENTS_ENDPOINT } from "@huckleberryai/core";
import { WebAnalyticsHTTPAccessEvent } from "@huckleberryai/web-analytics";

export const bus = Bus(IoC);

export default async (req: NowRequest, res: NowResponse) => {
  const ORIGIN_ID = "c7e384c3-697f-4ccf-a514-d54a452acfac";

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
  const accessEvent = WebAnalyticsHTTPAccessEvent(req, ORIGIN_ID);
  const result = await bus(accessEvent);
  if (IsError(result)) {
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
    const event = req.body;
    if (!IsEvent(event)) {
      res
        .status(BAD_REQUEST)
        .send(Result("data provided is not an event", BAD_REQUEST, ORIGIN_ID));
      return;
    }
    try {
      const result = await bus(event);
      res.status(result.status).send(result);
      return;
    } catch (error) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send(
          Result(
            error.toString(),
            INTERNAL_SERVER_ERROR,
            ORIGIN_ID,
            event.corr,
            event.parent ? event.parent : undefined
          )
        );
      return;
    }
  }
  res.status(NOT_FOUND).send(null);
};
