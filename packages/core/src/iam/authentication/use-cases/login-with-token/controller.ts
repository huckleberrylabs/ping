import { Request, Response } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { StatusCode, Errors, UUID } from "../../../../values";
import * as Command from "./command";
import { IHandler } from "./handler";
import { IAuthenticationService } from "../../../../interfaces";
import { ACCESS_TOKEN_EXPIRY } from "../../model";

export default (
  authentication: IAuthenticationService,
  handler: IHandler
) => async (req: Request, res: Response) => {
  // Decode
  const commandMaybe = Command.Codec.decode(req.body);
  if (isLeft(commandMaybe)) {
    res
      .status(StatusCode.BAD_REQUEST)
      .send(Errors.Parsing.Codec.encode(Errors.Parsing.C()));
    return;
  }

  // Handle
  const idMaybe = await handler(commandMaybe.right);

  // Encode
  if (isLeft(idMaybe)) {
    switch (idMaybe.left.type) {
      case Errors.Unauthenticated.Name:
        res
          .status(StatusCode.UNAUTHORIZED)
          .send(Errors.Unauthenticated.Codec.encode(idMaybe.left));
        return;
      case Errors.Adapter.Name:
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(Errors.Adapter.Codec.encode(idMaybe.left));
        return;
      default:
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send();
        return;
    }
  } else {
    // Set the auth cookie
    const sessionToken = authentication.generateToken(
      idMaybe.right,
      false,
      ACCESS_TOKEN_EXPIRY
    );
    res
      .cookie("auth", sessionToken, { httpOnly: true, secure: true })
      .status(StatusCode.OK)
      .send(UUID.Codec.encode(idMaybe.right));
  }
};
