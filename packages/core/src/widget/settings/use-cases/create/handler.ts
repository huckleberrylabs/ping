import { isLeft, Either, isRight, left } from "fp-ts/lib/Either";
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
  messaging: IMessagingService
): IHandler => async command => {
  // Check if a widget with the same id already exists
  const widgetMaybe = await repo.exists(command.widget.id);
  if (isRight(widgetMaybe)) return left(Errors.Validation.C());

  // Save the widget
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

  // Create Channel
  const channelMaybe = await messaging.createChannel(
    command.widget.account,
    command.router,
    command.widget.id,
    "widget"
  );
  if (isLeft(channelMaybe)) return channelMaybe;

  // TODO atomic exists + add
  // TODO create channel and grant authorization in subscribers?

  return savedMaybe;
};
