import { Request, Response } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { StatusCode, Errors } from "../../../../values";
import * as Query from "./query";
import * as Model from "../../model";
import { IHandler } from "./handler";

export default (handler: IHandler) => async (req: Request, res: Response) => {
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

  // Handle
  const result = await handler(query);

  // Encode
  if (isLeft(result)) {
    switch (result.left.type) {
      case Errors.NotFound.Name:
        res
          .status(StatusCode.NOT_FOUND)
          .send(Errors.NotFound.Encode(result.left));
        return;
      case Errors.Adapter.Name:
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(Errors.Adapter.Encode(result.left));
        return;
      default:
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(Errors.Adapter.Encode(result.left));
        return;
    }
  }
  res.status(StatusCode.OK).send(Model.Encode(result.right));
  return;
};
