import { Either, isLeft, isRight } from "fp-ts/lib/Either";
import { IAccountRepository, IEventBus } from "../../../../interfaces";
import { Errors } from "../../../../values";
import * as Event from "../../events/updated";
import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<Either<Errors.NotFound.T | Errors.Adapter.T, null>>;

export default (
  repo: IAccountRepository,
  bus: IEventBus
): IHandler => async command => {
  // Get the account
  const acccountMaybe = await repo.get(command.account);
  if (isLeft(acccountMaybe)) return acccountMaybe;
  const account = acccountMaybe.right;

  // Update Name
  account.name = name;

  // Reset email verification
  if (account.email.email !== command.email) {
    account.email.email = command.email;
    account.email.verified = false;
  }
  // TODO send new verification email

  // Update the account
  const updatedMaybe = await repo.update(account);

  // Publish event
  if (isRight(updatedMaybe)) bus.publish(Event.C(command));
  // TODO Update billing email when account email is updated

  return updatedMaybe;
};
