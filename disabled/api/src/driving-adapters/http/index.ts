import { isLeft } from "fp-ts/lib/Either";
import { NowRequest, NowResponse } from "@now/node";
import { StatusCode } from "@huckleberryai/core";
import WebAnalytics from "@huckleberryai/web-analytics";
import { HandlerMap } from "../../driving-ports";

export const PingController = async (req: NowRequest, res: NowResponse) =>
  res.status(StatusCode.OK).send(null);

export const http = (handlers: ReturnType<typeof HandlerMap>) => async (
  req: NowRequest,
  res: NowResponse
) => {
  // HTTP Access Filtering
  const accessEvent = WebAnalytics.Server.UseCases.HTTPAccess.Event.C(req);
  const accessResult = await handlers["web-analytics:client:loaded"](
    accessEvent
  );
  if (isLeft(accessResult)) {
    res.status(accessResult.left.status).send(accessResult.left);
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

  switch (req.url) {
    case "/ping":
      PingController(req, res);
      break;
    default:
      break;
  }
  /* 
  if (!req.url) {
    res.status(StatusCode.BAD_REQUEST).send(null);
    return;
  }
  const type = TypeFromPathName(req.url);
  const decoder = DecoderContainer(type);
   if (!decoder) {
    res.status(StatusCode.NOT_FOUND).send(null);
    return;
  }
  const event = decoder(req.body);
  if(isLeft(event)) {
    res.status(StatusCode.BAD_REQUEST).send(null);
    return;
  }
  const decoder

  pipe(
    map(async useCase =>
      pipe(
        useCase.codec.decode(req.body),
        
        map((event) => await useCase.handler(event)),
        map(result =>
          pipe(
            Container,
            map(map => map.codec.encode(result))
            map(() => res.status(result).send(null))
          )
        )
        // TODO Either<Error, Result> => encode => res.status.send
      )
    )
  ); */
};
