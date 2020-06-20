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
  const queryMaybe = Query.Codec.decode(req.body);
  if (isLeft(queryMaybe)) {
    res
      .status(StatusCode.BAD_REQUEST)
      .send(Errors.Parsing.Codec.encode(Errors.Parsing.C()));
    return;
  }
  const query = queryMaybe.right;

  // Check Authorization
  if (!req.authenticatedID) {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send(Errors.Unauthorized.Codec.encode(Errors.Unauthorized.C()));
    return;
  }
  const authMaybe = await auth.check(
    req.authenticatedID,
    query.account,
    query.type
  );
  if (isLeft(authMaybe)) {
    switch (authMaybe.left.type) {
      case Errors.Unauthorized.Name:
        res
          .status(StatusCode.FORBIDDEN)
          .send(Errors.Unauthorized.Codec.encode(authMaybe.left));
        return;
      case Errors.Adapter.Name:
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(Errors.Adapter.Codec.encode(authMaybe.left));
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
          .send(Errors.NotFound.Codec.encode(accountMaybe.left));
        return;
      case Errors.Adapter.Name:
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(Errors.Adapter.Codec.encode(accountMaybe.left));
        return;
      default:
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send();
        return;
    }
  } else {
    res.status(StatusCode.OK).send(Model.Codec.encode(accountMaybe.right));
  }
};
