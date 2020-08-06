import { Request, Response } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { StatusCode, Errors } from "../../../../values";
import * as Command from "./command";

export default () => async (req: Request, res: Response) => {
  // Decode
  const commandMaybe = Command.Codec.decode(req.body);
  if (isLeft(commandMaybe)) {
    res
      .status(StatusCode.BAD_REQUEST)
      .send(Errors.Parsing.Codec.encode(Errors.Parsing.C()));
    return;
  }
  if (req.authenticatedID) {
    res.status(StatusCode.OK).send(req.authenticatedID);
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send(Errors.Unauthenticated.Codec.encode(Errors.Unauthenticated.C()));
  }
};
