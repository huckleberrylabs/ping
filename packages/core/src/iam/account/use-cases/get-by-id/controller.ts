import { Request, Response } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { IAuthorizationService } from "../../../../interfaces";
import { StatusCode, Errors } from "../../../../values";
import * as Model from "../../model";
import * as Query from "./query";
import { IHandler } from "./handler";

export default (auth: IAuthorizationService, handler: IHandler) => async (
  req: Request,
  res: Response
) => {
  // Decode
  const queryMaybe = Query.Decode(req.body);
  if (isLeft(queryMaybe)) {
    res
      .status(StatusCode.BAD_REQUEST)
      .send(
        Errors.Validation.Encode(
          Errors.Validation.C(
            Query.Name,
            `DTO decode error: ${queryMaybe.left.toString()}`
          )
        )
      );
    return;
  }
  const query = queryMaybe.right;

  // Check Authorization
  if (!req.authenticatedID) {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send(
        Errors.Unauthenticated.Encode(Errors.Unauthenticated.C(Query.Name))
      );
    return;
  }
  const authMaybe = await auth.check({
    account: req.authenticatedID,
    entity: query.account,
    action: query.type,
  });
  if (isLeft(authMaybe)) {
    switch (authMaybe.left.type) {
      case Errors.Unauthorized.Name:
        res
          .status(StatusCode.FORBIDDEN)
          .send(Errors.Unauthorized.Encode(authMaybe.left));
        return;
      case Errors.Adapter.Name:
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(Errors.Adapter.Encode(authMaybe.left));
        return;
      default:
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send();
        return;
    }
  }

  // Handle
  const accountMaybe = await handler(query);

  // Encode
  if (isLeft(accountMaybe)) {
    switch (accountMaybe.left.type) {
      case Errors.NotFound.Name:
        res
          .status(StatusCode.NOT_FOUND)
          .send(Errors.NotFound.Encode(accountMaybe.left));
        return;
      case Errors.Adapter.Name:
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(Errors.Adapter.Encode(accountMaybe.left));
        return;
      default:
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send();
        return;
    }
  } else {
    res.status(StatusCode.OK).send(Model.Encode(accountMaybe.right));
  }
};
