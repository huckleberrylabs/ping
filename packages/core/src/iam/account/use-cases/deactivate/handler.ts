import { Either, left } from "fp-ts/lib/Either";
import { IAccountRepository, IEventBus } from "../../../../interfaces";
import { Errors } from "../../../../values";
// import * as Event from "../../events/deactivate";
import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<
  Either<Errors.NotFound.T | Errors.Adapter.T | Errors.NotImplemented.T, null>
>;

export default (
  repo: IAccountRepository,
  bus: IEventBus
): IHandler => async command => {
  // TODO mark account model as deactivated and update repo. refactor repo to return only accounts marked active

  // TODO send email

  // Publish event
  // if (isRight(updatedMaybe)) bus.publish(Event.C(command));
  // TODO Update billing and widgets

  return left(Errors.NotImplemented.C());
};
