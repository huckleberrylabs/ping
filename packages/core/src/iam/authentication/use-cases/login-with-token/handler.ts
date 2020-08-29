import { Either, isRight, right } from "fp-ts/lib/Either";
import { UUID, Errors } from "../../../../values";
import { IAuthenticationService, IEventBus } from "../../../../interfaces";
import * as Event from "../../events/logged-in-with-token";
import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<Either<Errors.Adapter.T | Errors.Unauthenticated.T, UUID.T>>;

export default (
  authentication: IAuthenticationService,
  bus: IEventBus
): IHandler => async command => {
  // Authenticate the Token
  const authenticatedMaybe = await authentication.authenticateToken(
    command.token
  );

  if (isRight(authenticatedMaybe)) {
    // Publish event
    bus.publish(Event.C(command));
    // TODO Publish Unsuccessful Login Attempt?
    // TODO verify email
    return right(authenticatedMaybe.right.account);
  }

  return authenticatedMaybe;
};
