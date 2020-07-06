import { Either, isLeft, isRight, left } from "fp-ts/lib/Either";
import { IAccountRepository, IEventBus } from "../../../../interfaces";
import { Errors } from "../../../../values";
import * as Event from "../../events/updated";
import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<
  Either<Errors.NotFound.T | Errors.Adapter.T | Errors.Validation.T, null>
>;

export default (
  repo: IAccountRepository,
  bus: IEventBus
): IHandler => async command => {
  // Get the account
  const acccountMaybe = await repo.get(command.account);
  if (isLeft(acccountMaybe)) return acccountMaybe;
  const account = acccountMaybe.right;

  // Update Name
  account.name = command.name;

  // Update Email
  if (account.email.address !== command.email) {
    // Check if account with same email already exists
    const accountMaybe = await repo.getByEmail(command.email);
    if (isRight(accountMaybe)) return left(Errors.Validation.C());

    // Reset email verification
    account.email.address = command.email;
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
