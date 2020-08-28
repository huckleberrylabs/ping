import { isLeft, Either } from "fp-ts/lib/Either";
import { Errors } from "../../../../values";
import {
  IWidgetRepository,
  IAuthorizationService,
  IMessagingService,
} from "../../../../interfaces";
import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<
  Either<Errors.NotFound.T | Errors.Validation.T | Errors.Adapter.T, null>
>;

export default (
  repo: IWidgetRepository,
  auth: IAuthorizationService,
  messageService: IMessagingService
): IHandler => async command => {
  // Add the widget if it does not already exist
  const savedMaybe = await repo.add(command.widget);
  if (isLeft(savedMaybe)) return savedMaybe;

  // Grant Authorization for all actions between account and widget
  const authMaybe = await auth.grant({
    account: command.widget.account,
    entity: command.widget.id,
  });
  if (isLeft(authMaybe)) {
    await repo.remove(command.widget.id);
    return authMaybe;
  }

  messageService.createChannel(
    command.widget.account,
    command.widget.id,
    "widget"
  );

  return savedMaybe;
};
