import { pipe } from "fp-ts/lib/pipeable";
import { map, mapLeft, isLeft } from "fp-ts/lib/Either";
import { NowRequest, NowResponse } from "@now/node";
import { EventTypeFromPathName, StatusCode } from "@huckleberryai/core";
import { Server } from "@huckleberryai/web-analytics";
import { Container } from "../../driving-ports";

export const http = async (req: NowRequest, res: NowResponse) => {
  // HTTP Access Filtering
  const accessEvent = Server.UseCases.HTTPAccess.Event(req);
  const accessResult = Server.UseCases.HTTPAccess.Handler(accessEvent);
  if (isLeft(accessResult)) {
    // TODO encode
    res.status(accessResult.status).send(accessResult);
    return;
  }

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "3600");
    res.status(204).send("");
    return;
  }

  // Ping
  if (req.url === "/ping") {
    res.status(StatusCode.OK).send(null);
    return;
  }

  pipe(
    EventTypeFromPathName(req.url),
    Container,
    mapLeft(() => res.status(StatusCode.NOT_FOUND).send(null)),
    map(async useCase =>
      pipe(
        useCase.codec.decode(req.body),
        mapLeft(() => res.status(StatusCode.BAD_REQUEST).send(null)),
        map(await useCase.handler)
        // TODO Either<Error, Result> => encode => res.status.send
      )
    )
  );
};
