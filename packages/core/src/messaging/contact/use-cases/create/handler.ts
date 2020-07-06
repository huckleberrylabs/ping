import { isLeft, Either, isRight, left } from "fp-ts/lib/Either";
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
  // Check if a router with the same id already exists
  const routerMaybe = await repo.exists(command.contact.id);
  if (isRight(routerMaybe)) return left(Errors.Validation.C());

  // Save the widget
  const savedMaybe = await repo.add(command.contact);
  if (isLeft(savedMaybe)) return savedMaybe;

  // Grant Authorization for all actions between account and widget
  const authMaybe = await auth.grant({
    account: command.contact.account,
    entity: command.contact.id,
  });
  if (isLeft(authMaybe)) {
    await repo.remove(command.contact.id);
    return authMaybe;
  }

  // TODO atomic exists + add

  return savedMaybe;
};
