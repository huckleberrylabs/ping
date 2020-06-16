import { Request, Response } from "express";
import { isLeft } from "fp-ts/lib/Either";
import * as Command from "./command";
import { IHandler } from "./handler";
import { StatusCode } from "@huckleberrylabs/core";

export default (handler: IHandler) => async (req: Request, res: Response) => {
  const commandMaybe = Command.Codec.decode(req.body);
  if (isLeft(commandMaybe)) {
    res.status(StatusCode.BAD_REQUEST).send(commandMaybe);
    return;
  }
  const result = await handler(commandMaybe.right);
  res.status(StatusCode.OK).send(result);
};
