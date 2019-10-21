// @ts-ignore
import * as iots from "io-ts";
import { isLeft } from "fp-ts/lib/Either";
import express from "express";
import cors from "cors";
import { StatusCode, HTTP, Results } from "@huckleberryai/core";
import * as WebAnalytics from "@huckleberryai/web-analytics";
import Container from "../../container";
import Codecs, { Names } from "../../codecs";

export const C = () => {
  const ports = Container();
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use((req, res, next) => {
    console.log(req.url);
    next();
  });
  app.use(async (req, res, next) => {
    // Access Filtering
    const accessEvent = WebAnalytics.Server.UseCases.HTTPAccess.Event.C(req);
    const accessPort = ports.get(accessEvent.type);
    if (!accessPort) {
      res.status(StatusCode.NOT_FOUND).send(null);
      return;
    }
    const accessResult = await accessPort(accessEvent);
    console.log("access filtering status code: ", accessResult.status);
    if (accessResult.type === Results.Forbidden.Name) {
      res
        .status(accessResult.status)
        .send(Results.Forbidden.Codec.encode(accessResult));
      return;
    }
    next();
  });
  app.get("/ping", (req, res) => {
    res.status(StatusCode.OK).send(null);
  });
  app.use(async (req, res) => {
    if (!req.url) {
      res.status(StatusCode.BAD_REQUEST).send(null);
      return;
    }
    const maybeType = HTTP.TypeFromPathName(
      new URL(req.url, "http://localhost").pathname
    );
    if (isLeft(maybeType)) {
      res.status(StatusCode.BAD_REQUEST).send(null);
      return;
    }
    const type = maybeType.right;
    console.log("request type: ", type);
    const dtoCodec = Codecs.get(type as Names);
    if (!dtoCodec) {
      console.log("Codec Not Found", type);
      res.status(StatusCode.NOT_FOUND).send(null);
      return;
    }
    const maybeDto = dtoCodec.decode(req.body);
    if (isLeft(maybeDto)) {
      console.log("Bad DTO: ", req.body);
      res.status(StatusCode.BAD_REQUEST).send(null);
      return;
    }
    const dto = maybeDto.right;
    const port = ports.get(type);
    if (!port) {
      console.log("Port Not Found", type);
      res.status(StatusCode.NOT_FOUND).send(null);
      return;
    }
    console.log("request: ", dto);
    const result = await port(dto);
    console.log("result status: ", result.status);
    let resultCodec = Codecs.get(result.type);
    if (resultCodec === undefined) {
      console.log("Result Codec Not Found", result);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send(null);
      return;
    }
    if (resultCodec === null) {
      const innerCodec = Codecs.get((result as any).dataType);
      if (!innerCodec) {
        console.log("Inner Codec Not Found", (result as any).dataType);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send(null);
        return;
      }
      resultCodec = Results.OKWithData.Codec(innerCodec);
    }

    res.status(result.status).send(resultCodec.encode(result));
  });
  return app;
};
