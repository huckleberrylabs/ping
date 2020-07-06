import { Request, Response } from "express";
import * as Command from "./command";
import { IHandler } from "./handler";
import { isLeft } from "fp-ts/lib/Either";
import { StatusCode, Errors, NonEmptyString, Phone } from "../../../values";

export default (handler: IHandler) => async (req: Request, res: Response) => {
  // Decode
  // TODO Use other request information: To/FromCountry, NumSegments, NumMedia, To/FromCity
  console.log(req.body);
  const content = req.body.Body;
  const twilio = req.body.To; // TWILIO
  const from = req.body.From; // Person
  if (!(NonEmptyString.Is(content) && Phone.Is(twilio) && Phone.Is(from))) {
    res
      .status(StatusCode.BAD_REQUEST)
      .send(Errors.Parsing.Codec.encode(Errors.Parsing.C()));
    return;
  }
  const command = Command.C(content, twilio, from);

  // Handle
  const successMaybe = await handler(command);
  console.log(successMaybe);

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
