import { isLeft, Either } from "fp-ts/lib/Either";
import { Errors } from "../../../../values";
import {
  IRouterRepository,
  IAuthorizationService,
} from "../../../../interfaces";
import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<
  Either<Errors.NotFound.T | Errors.Validation.T | Errors.Adapter.T, null>
>;

export default (
  repo: IRouterRepository,
  auth: IAuthorizationService
): IHandler => async command => {
  // Add the router if it does not already exist
  const savedMaybe = await repo.add(command.router);
  if (isLeft(savedMaybe)) return savedMaybe;

  // Grant Authorization for all actions between account and router
  const authMaybe = await auth.grant({
    account: command.router.id,
    entity: command.router.id,
  });
  if (isLeft(authMaybe)) {
    await repo.remove(command.router.id);
    return authMaybe;
  }

  return savedMaybe;
};
