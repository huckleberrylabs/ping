import { Request, Response } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { StatusCode, Errors } from "../../../../values";
import * as Command from "./command";

export default () => async (req: Request, res: Response) => {
  // Decode
  const commandMaybe = Command.Decode(req.body);
  if (isLeft(commandMaybe)) {
    res
      .status(StatusCode.BAD_REQUEST)
      .send(
        Errors.Validation.Encode(
          Errors.Validation.C(
            Command.Name,
            `DTO decode error: ${commandMaybe.left.toString()}`
          )
        )
      );
    return;
  }

  // Clear cookie
  res
    .clearCookie("Auth")
    .status(StatusCode.OK)
    .send();
};
