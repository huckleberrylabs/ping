import { Request, Response } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { StatusCode, Errors } from "../../../../values";
import * as Query from "./query";
import * as Model from "../../model";
import { IHandler } from "./handler";
import { IAuthorizationService } from "../../../../interfaces";

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
  const authMaybe = await auth.check({
    account: req.authenticatedID,
    entity: query.router,
    action: query.type,
  });
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
  const result = await handler(query);

  // Encode
  if (isLeft(result)) {
    switch (result.left.type) {
      case Errors.NotFound.Name:
        res
          .status(StatusCode.NOT_FOUND)
          .send(Errors.NotFound.Codec.encode(result.left));
        return;
      case Errors.Adapter.Name:
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(Errors.Adapter.Codec.encode(result.left));
        return;
      default:
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(Errors.Adapter.Codec.encode(result.left));
        return;
    }
  }
  res.status(StatusCode.OK).send(Model.Codec.encode(result.right));
  return;
};
