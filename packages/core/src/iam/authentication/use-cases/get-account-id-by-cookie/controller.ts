import { Request, Response } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { StatusCode, Errors } from "../../../../values";
import * as Query from "./query";

export default () => async (req: Request, res: Response) => {
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
  if (req.authenticatedID) {
    res.status(StatusCode.OK).send(req.authenticatedID);
  } else {
    res
      .status(StatusCode.UNAUTHORIZED)
      .send(
        Errors.Unauthenticated.Encode(Errors.Unauthenticated.C(Query.Name))
      );
  }
};
