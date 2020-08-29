import { Either, isLeft, right } from "fp-ts/lib/Either";
import { Errors } from "../../../../values";
import { IRouterRepository } from "../../../../interfaces";
import * as Query from "./query";
import * as Model from "../../model";

export type IHandler = (
  query: Query.T
) => Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Model.T>>;

export default (repo: IRouterRepository): IHandler => async query => {
  // Retrieve the router
  const routerMaybe = await repo.get(query.router);
  if (isLeft(routerMaybe)) return routerMaybe;
  const router = routerMaybe.right;
  return right(router);
};
