import { Request, Response } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { IAuthorizationService } from "../../../../interfaces";
import { StatusCode, Errors } from "../../../../values";
import * as Command from "./command";
import { IHandler } from "./handler";

export default (auth: IAuthorizationService, handler: IHandler) => async (
  req: Request,
  res: Response
) => {
  // Decode
  const commandMaybe = Command.Codec.decode(req.body);
  console.log(commandMaybe);
  if (isLeft(commandMaybe)) {
    res
      .status(StatusCode.BAD_REQUEST)
      .send(Errors.Parsing.Codec.encode(Errors.Parsing.C()));
    return;
  }
  const command = commandMaybe.right;

  // Check Authorization
  if (!req.authenticatedID) {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send(Errors.Unauthorized.Codec.encode(Errors.Unauthorized.C()));
    return;
  }

  // Handle
  const successMaybe = await handler(command);
  console.log(successMaybe);

  // Encode
  if (isLeft(successMaybe)) {
    switch (successMaybe.left.type) {
      case Errors.NotFound.Name:
        res
          .status(StatusCode.NOT_FOUND)
          .send(Errors.NotFound.Codec.encode(successMaybe.left));
        return;
      case Errors.Validation.Name:
        res
          .status(StatusCode.BAD_REQUEST)
          .send(Errors.Validation.Codec.encode(successMaybe.left));
        return;
      case Errors.Adapter.Name:
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(Errors.Adapter.Codec.encode(successMaybe.left));
        return;
      default:
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send();
        return;
    }
  } else {
    res.status(StatusCode.OK).send();
  }
};
