import { isLeft, Either } from "fp-ts/lib/Either";
import { Errors, UUID } from "../../../../values";
import { IWidgetRepository, IMessagingService } from "../../../../interfaces";
import * as Command from "./command";
import { Message } from "../../../../messaging";
import { none } from "fp-ts/lib/Option";

export type IHandler = (
  command: Command.T
) => Promise<
  Either<Errors.NotFound.T | Errors.Validation.T | Errors.Adapter.T, null>
>;

export default (
  repo: IWidgetRepository,
  messaging: IMessagingService
): IHandler => async command => {
  // Retrieve the widget
  const widgetMaybe = await repo.get(command.widget);
  if (isLeft(widgetMaybe)) return widgetMaybe;
  const widget = widgetMaybe.right;

  // Create The Contact (if doesnt already exist)
  const contactMaybe = await messaging.createContact({
    account: widget.account,
    name: command.message.name,
    phone: command.message.phone,
  });
  if (isLeft(contactMaybe)) return contactMaybe;
  const contact = contactMaybe.right;

  // Create the Message
  const message: Message.Model.T = {
    id: UUID.C(),
    timestamp: command.message.timestamp,
    content: command.message.text,
    from: contact,
    account: widget.account,
    conversation: none,
  };

  // Send the Message
  return messaging.sendMessage(message);
};
