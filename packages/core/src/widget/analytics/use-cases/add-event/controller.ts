import { Request, Response } from "express";
import { isLeft } from "fp-ts/lib/Either";
import * as Command from "./command";
import { IHandler } from "./handler";
import { StatusCode, Errors } from "../../../../values";

export default (handler: IHandler) => async (req: Request, res: Response) => {
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

  // Handle
  const result = await handler(commandMaybe.right);

  // Encode
  if (isLeft(result)) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send(Errors.Adapter.Encode(result.left));
  } else {
    res.status(StatusCode.OK).send();
  }
};
