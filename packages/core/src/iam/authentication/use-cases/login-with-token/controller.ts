import { Request, Response } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { StatusCode, Errors, UUID, Env } from "../../../../values";
import * as Command from "./command";
import { IHandler } from "./handler";
import { IAuthenticationService } from "../../../../interfaces";
import { ACCESS_TOKEN_EXPIRY } from "../../model";

export default (
  authentication: IAuthenticationService,
  handler: IHandler
) => async (req: Request, res: Response) => {
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
  const idMaybe = await handler(commandMaybe.right);

  // Encode
  if (isLeft(idMaybe)) {
    switch (idMaybe.left.type) {
      case Errors.Unauthenticated.Name:
        res
          .status(StatusCode.UNAUTHORIZED)
          .send(Errors.Unauthenticated.Encode(idMaybe.left));
        return;
      case Errors.Adapter.Name:
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(Errors.Adapter.Encode(idMaybe.left));
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
      .cookie("Auth", sessionToken, {
        httpOnly: true,
        secure: Env.Get() === "production",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: "none",
        path: "/",
        // domain defaults to host (not including sub-domain)
      })
      .status(StatusCode.OK)
      .send(UUID.Encode(idMaybe.right));
  }
};
