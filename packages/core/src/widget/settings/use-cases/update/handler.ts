import { Either } from "fp-ts/lib/Either";
import { Errors } from "../../../../values";
import { IWidgetRepository } from "../../../../interfaces";
import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<Either<Errors.NotFound.T | Errors.Adapter.T, null>>;

export default (repo: IWidgetRepository) => async (command: Command.T) => {
  // Update the widget
  const updatedMaybe = await repo.update(command.widget);
  return updatedMaybe;
};
