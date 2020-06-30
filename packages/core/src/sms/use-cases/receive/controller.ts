import { Request, Response } from "express";
import * as Command from "./command";
import { IHandler } from "./handler";
import { isLeft } from "fp-ts/lib/Either";
import { StatusCode, Errors } from "../../../values";

export default (handler: IHandler) => async (req: Request, res: Response) => {
  // Decode
  const commandMaybe = Command.Codec.decode({
    type: Command.Name,
    content: req.body.Body,
    to: req.body.To,
    from: req.body.From,
  });
  if (isLeft(commandMaybe)) {
    res
      .status(StatusCode.BAD_REQUEST)
      .send(Errors.Parsing.Codec.encode(Errors.Parsing.C()));
    return;
  }

  // Handle
  const successMaybe = await handler(commandMaybe.right);

  // Encode
  if (isLeft(successMaybe)) {
    switch (successMaybe.left.type) {
      case Errors.NotFound.Name:
        res.status(StatusCode.NOT_FOUND).send();
        return;
      case Errors.Adapter.Name:
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send();
        return;
      default:
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send();
        return;
    }
  } else {
    res.writeHead(StatusCode.OK, {
      "Content-Type": "text/xml",
    });
    res.end(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
  }
};
