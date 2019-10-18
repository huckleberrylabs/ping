// @ts-ignore
import * as iots from "io-ts";
import { isLeft } from "fp-ts/lib/Either";
import { NowRequest, NowResponse } from "@now/node";
import { StatusCode, TypeFromPathName, Results } from "@huckleberryai/core";
import * as WA from "@huckleberryai/web-analytics";
import DrivingPorts from "../../driving-ports";
import Mappers from "../../mappers";

const ports = DrivingPorts();

export const Controller = async (req: NowRequest, res: NowResponse) => {
  if (!req.url) {
    res.status(StatusCode.BAD_REQUEST).send(null);
    return;
  }
  const maybeType = TypeFromPathName(req.url);
  if (isLeft(maybeType)) {
    res.status(StatusCode.BAD_REQUEST).send(null);
    return;
  }
  const type = maybeType.right;
  const mapper = Mappers[type];
  if (!mapper) {
    res.status(StatusCode.NOT_FOUND).send(null);
    return;
  }
  const maybeEvent = mapper.decode(req.body);
  if (isLeft(maybeEvent)) {
    res.status(StatusCode.BAD_REQUEST).send(null);
    return;
  }
  const event = maybeEvent.right;
  const port = ports[event.type];
  if (!port) {
    res.status(StatusCode.NOT_FOUND).send(null);
    return;
  }
  const result = await port(event);
  const encoder = Results.encoders.get(result.type);
  if (!encoder) {
    const error = Results.Error.C(event);
    res.status(error.status).send(error);
    return;
  }
  encoder(result);
};

export const HTTP = async (req: NowRequest, res: NowResponse) => {
  // Access Filtering
  const accessEvent = WA.Server.UseCases.HTTPAccess.Event.C(req);
  const accessPort = ports[accessEvent.type];
  if (!accessPort) {
    res.status(StatusCode.NOT_FOUND).send(null);
    return;
  }
  const accessResult = await accessPort(accessEvent);
  if (accessResult.type === Results.Forbidden.Name) {
    res.status(accessResult.status).send(accessResult);
    return;
  }

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "3600");
    res.status(204).send(null);
    return;
  }

  if (req.url === "/ping") {
    res.status(StatusCode.OK).send(null);
    return;
  }

  Controller(req, res);
};
