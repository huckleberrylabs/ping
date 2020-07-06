import { Either } from "fp-ts/lib/Either";
import { Errors } from "../../../../values";
import { IRouterRepository } from "../../../../interfaces";
import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<Either<Errors.NotFound.T | Errors.Adapter.T, null>>;

export default (repo: IRouterRepository) => async (command: Command.T) => {
  // Update the router
  const updatedMaybe = await repo.update(command.router);
  return updatedMaybe;
};
