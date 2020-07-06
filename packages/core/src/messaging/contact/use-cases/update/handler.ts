import { Either } from "fp-ts/lib/Either";
import { Errors } from "../../../../values";
import { IContactRepository } from "../../../../interfaces";
import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<Either<Errors.NotFound.T | Errors.Adapter.T, null>>;

export default (repo: IContactRepository) => async (command: Command.T) => {
  // Update the contact
  const updatedMaybe = await repo.update(command.contact);
  return updatedMaybe;
};
