import { Either } from "fp-ts/lib/Either";
import { Errors } from "../../../../values";
import { IWidgetRepository } from "../../../../interfaces";
import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;

export default (repo: IWidgetRepository): IHandler => async query =>
  repo.remove(query.widget);
