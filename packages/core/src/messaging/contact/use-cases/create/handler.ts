import { isLeft, Either } from "fp-ts/lib/Either";
import { Errors } from "../../../../values";
import {
  IContactRepository,
  IAuthorizationService,
} from "../../../../interfaces";
import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<
  Either<Errors.NotFound.T | Errors.Validation.T | Errors.Adapter.T, null>
>;

export default (
  repo: IContactRepository,
  auth: IAuthorizationService
): IHandler => async command => {
  // Add the contact if it does not already exist
  const savedMaybe = await repo.add(command.contact);
  if (isLeft(savedMaybe)) return savedMaybe;

  // Grant Authorization for all actions between account and contact
  const authMaybe = await auth.grant({
    account: command.contact.account,
    entity: command.contact.id,
  });
  if (isLeft(authMaybe)) {
    await repo.remove(command.contact.id);
    return authMaybe;
  }

  return savedMaybe;
};
