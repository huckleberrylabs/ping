import { IEvent } from "@huckleberry/core";
import {
  TextWidgetMessageAddedCommand,
  TextWidgetNameAddedCommand,
  TextWidgetPhoneAddedCommand,
} from "@huckleberry/text";

export const MessageAggregator = (events: IEvent[]) => {
  // Name
  const nameCommand = events.filter(
    event => event instanceof TextWidgetNameAddedCommand
  )[0];
  let name = null;
  if (nameCommand instanceof TextWidgetNameAddedCommand) {
    name = nameCommand.name;
  }

  // Message
  const messageCommand = events.filter(
    event => event instanceof TextWidgetMessageAddedCommand
  )[0];
  let message = null;
  if (messageCommand instanceof TextWidgetMessageAddedCommand) {
    message = messageCommand.message;
  }

  // Phone
  const phoneCommand = events.filter(
    event => event instanceof TextWidgetPhoneAddedCommand
  )[0];
  let phone = null;
  if (phoneCommand instanceof TextWidgetPhoneAddedCommand) {
    phone = phoneCommand.phone;
  }

  if (name === null || message === null || phone === null) {
    throw new Error("Events Missing");
  }
  return {
    name,
    message,
    phone,
  };
};
