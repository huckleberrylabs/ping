import { isLeft } from "fp-ts/lib/Either";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  StatusCode,
  HTTP,
  Results,
  NonEmptyString,
  UUID,
  Errors,
} from "@huckleberryai/core";
import * as WebAnalytics from "@huckleberryai/web-analytics";
import * as Ping from "@huckleberryai/ping";
import Container from "../../container";
import Codecs, { Names } from "../../codecs";
import { IAMService } from "../../driven-ports";

const iamMaybe = IAMService.C();
if (isLeft(iamMaybe)) throw new Error("iam private key missing");
const iam = iamMaybe.right;

export const C = () => {
  const ports = Container();
  const app = express();

  app.use(cookieParser());
  app.use(
    express.json({
      type: ["*/json", "text/plain"],
    })
  );

  // Logging
  app.use((req, res, next) => {
    console.log(req.url);
    next();
  });

  // Security
  app.use(cookieParser());
  app.use(cors());

  // Analytics
  app.use(async (req, res, next) => {
    const accessEvent = WebAnalytics.Server.UseCases.HTTPAccess.Event.C(req);
    const accessPort = ports.get(accessEvent.type);
    if (accessPort) await accessPort(accessEvent);
    next();
  });

  // Authenticate
  app.use(async (req, res, next) => {
    const token = req.cookies["auth"];
    if (NonEmptyString.Is(token)) {
      const authenticatedMaybe = iam.authenticateToken(token);
      if (isLeft(authenticatedMaybe)) {
        res
          .clearCookie("auth")
          .status(StatusCode.UNAUTHORIZED)
          .send();
        return;
      }
    }
    next();
  });

  // Login
  app.post(
    HTTP.PathNameFromType(Ping.Account.UseCases.LoginWithToken.Command.Name),
    async (req, res) => {
      const commandMaybe = Ping.Account.UseCases.LoginWithToken.Command.Codec.decode(
        req.body
      );
      if (isLeft(commandMaybe)) {
        console.log("Bad DTO: ", req.body);
        res.status(StatusCode.BAD_REQUEST).send(null);
        return;
      }
      const command = commandMaybe.right;
      console.log("Log in Command: ", command);
      const authenticatedMaybe = iam.authenticateToken(command.token);
      let result;
      if (isLeft(authenticatedMaybe)) {
        switch (authenticatedMaybe.left.type) {
          case Errors.Unauthenticated.Name:
            result = Results.Unauthorized.C(command);
            break;
          default:
            result = Results.BadRequest.C(command);
        }
      } else {
        const handler = ports.get(command.type);
        result = handler ? await handler(command) : Results.Error.C(command);
        if (Results.OKWithData.Codec(UUID.Codec).is(result)) {
          const sessionToken = iam.generateToken(result.data);
          res.cookie("auth", sessionToken);
        }
      }
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

      console.log("Log in Result: ", result);
      res.status(result.status).send(resultCodec.encode(result));
    }
  );

  // Logout
  app.post(
    HTTP.PathNameFromType(Ping.Account.UseCases.Logout.Command.Name),
    async (req, res) => {
      const commandMaybe = Ping.Account.UseCases.Logout.Command.Codec.decode(
        req.body
      );
      if (isLeft(commandMaybe)) {
        console.log("Bad DTO: ", req.body);
        res.status(StatusCode.BAD_REQUEST).send(null);
        return;
      }
      const command = commandMaybe.right;
      const handler = ports.get(command.type);
      const result = handler
        ? await handler(command)
        : Results.Error.C(command);
      console.log("Log out Result: ", result);
      res
        .clearCookie("auth")
        .status(result.status)
        .send(result);
    }
  );
  // Health
  app.get("/ping", (req, res) => {
    res.status(StatusCode.OK).send(null);
  });

  // Handlers
  app.use(async (req, res) => {
    if (!req.url) {
      res.status(StatusCode.BAD_REQUEST).send(null);
      return;
    }
    const maybeType = HTTP.TypeFromPathName(
      new URL(req.url, "http://example.com").pathname
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
    console.log("result: ", result);
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
