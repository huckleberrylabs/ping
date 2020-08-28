import { Either } from "fp-ts/lib/Either";
import { Errors } from "../../../../values";
import { IContactRepository } from "../../../../interfaces";
import * as Query from "./query";
import * as Model from "../../model";

export type IHandler = (
  query: Query.T
) => Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Model.T[]>>;

export default (repo: IContactRepository): IHandler => async query =>
  repo.getByAccount(query.account);
