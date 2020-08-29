import { isLeft } from "fp-ts/lib/Either";
import { Request, Response, NextFunction } from "express";
import { NonEmptyString, StatusCode, Errors } from "../../../../values";
import { IAuthenticationService } from "../../../../interfaces";

export default (authenticationService: IAuthenticationService) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["Auth"];
  if (NonEmptyString.Is(token)) {
    const authenticatedMaybe = await authenticationService.authenticateToken(
      token
    );
    if (isLeft(authenticatedMaybe)) {
      switch (authenticatedMaybe.left.type) {
        case Errors.Unauthenticated.Name:
          res
            .clearCookie("Auth")
            .status(StatusCode.UNAUTHORIZED)
            .send(Errors.Unauthenticated.Encode(authenticatedMaybe.left));
          return;
        case Errors.Adapter.Name:
          res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .send(Errors.Adapter.Encode(authenticatedMaybe.left));
          return;
        default:
          res
            .clearCookie("Auth")
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .send();
          return;
      }
    }
    req.authenticatedID = authenticatedMaybe.right.account;
  }
  next();
};
