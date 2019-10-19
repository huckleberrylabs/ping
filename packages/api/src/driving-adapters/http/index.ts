// @ts-ignore
import * as iots from "io-ts";
import { isLeft } from "fp-ts/lib/Either";
import { NowRequest, NowResponse } from "@now/node";
import { StatusCode, HTTP, Results } from "@huckleberryai/core";
import * as WebAnalytics from "@huckleberryai/web-analytics";
import Container from "../../container";
import Codecs, { Names } from "../../codecs";

const ports = Container();

export const Controller = async (req: NowRequest, res: NowResponse) => {
  if (!req.url) {
    res.status(StatusCode.BAD_REQUEST).send(null);
    return;
  }
  const maybeType = HTTP.TypeFromPathName(req.url);
  if (isLeft(maybeType)) {
    res.status(StatusCode.BAD_REQUEST).send(null);
    return;
  }
  const type = maybeType.right;
  const dtoCodec = Codecs.get(type as Names);
  if (!dtoCodec) {
    res.status(StatusCode.NOT_FOUND).send(null);
    return;
  }
  if (typeof dtoCodec === "function") {
    // shouldn't ever happen because Result.OKWithData shouldn't be received
    res.status(StatusCode.BAD_REQUEST).send(null);
    return;
  }
  const maybeDto = dtoCodec.decode(req.body);
  if (isLeft(maybeDto)) {
    res.status(StatusCode.BAD_REQUEST).send(null);
    return;
  }
  const dto = maybeDto.right;
  const port = ports.get(type);
  if (!port) {
    res.status(StatusCode.NOT_FOUND).send(null);
    return;
  }
  const result = await port(dto);
  let resultCodec = Codecs.get(result.type);
  if (typeof resultCodec === "function") {
    const innerCodec = Codecs.get((result as any).dataType);
    if (!resultCodec || !innerCodec || typeof innerCodec === "function") {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send(null);
      return;
    }
    resultCodec = resultCodec(innerCodec);
  }
  if (!resultCodec) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send(null);
    return;
  }
  res.status(result.status).send(resultCodec.encode(result));
};

export const http = async (req: NowRequest, res: NowResponse) => {
  // Access Filtering
  const accessEvent = WebAnalytics.Server.UseCases.HTTPAccess.Event.C(req);
  const accessPort = ports.get(accessEvent.type);
  if (!accessPort) {
    res.status(StatusCode.NOT_FOUND).send(null);
    return;
  }
  const accessResult = await accessPort(accessEvent);
  if (accessResult.type === Results.Forbidden.Name) {
    res
      .status(accessResult.status)
      .send(Results.Forbidden.Codec.encode(accessResult));
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
