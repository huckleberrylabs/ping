import { isLeft, Either } from "fp-ts/lib/Either";
import { none } from "fp-ts/lib/Option";
import { IWidgetRepository, IMessagingService } from "../../../../interfaces";
import { Errors, UUID } from "../../../../values";
import { Message } from "../../../../messaging";
import * as Command from "./command";

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
    internal: false,
    name: command.message.name,
    phone: command.message.phone,
  });
  if (isLeft(contactMaybe)) return contactMaybe;
  const contact = contactMaybe.right;

  // Create the Message
  const message: Message.Model.T = {
    type: Message.Model.Name,
    id: UUID.C(),
    timestamp: command.message.timestamp,
    content: command.message.text,
    channel: widget.id,
    from: contact,
    account: widget.account,
    conversation: none,
    meta: {},
  };

  // Send the Message
  return messaging.sendMessage(message);
};
