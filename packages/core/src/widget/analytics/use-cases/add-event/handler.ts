import { Either } from "fp-ts/lib/Either";
import { IAnalyticsRepository } from "../../../../interfaces";
import * as Command from "./command";
import * as Model from "../../model";
import { Errors } from "../../../../values";

export type IHandler = (
  event: Command.T
) => Promise<Either<Errors.Adapter.T, null>>;

export default (repo: IAnalyticsRepository): IHandler => async command =>
  repo.add(command.widget, Model.C(command.widget, command.action));
