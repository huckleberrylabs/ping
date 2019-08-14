import { IEvent } from "@huckleberryai/core";
import {
  TextWidgetMessageAddedCommand,
  TextWidgetNameAddedCommand,
  TextWidgetPhoneAddedCommand,
} from "@huckleberryai/text";

export function MessageAggregator(events: IEvent[]) {
  // Name
  const nameCommand = <TextWidgetNameAddedCommand | undefined>(
    events.filter(event => event instanceof TextWidgetNameAddedCommand)[0]
  );
  const name = nameCommand ? nameCommand.name : null;

  // Message
  const messageCommand = <TextWidgetMessageAddedCommand | undefined>(
    events.filter(event => event instanceof TextWidgetMessageAddedCommand)[0]
  );
  const message = messageCommand ? messageCommand.message : null;

  // Phone
  const phoneCommand = <TextWidgetPhoneAddedCommand | undefined>(
    events.filter(event => event instanceof TextWidgetPhoneAddedCommand)[0]
  );
  const phone = phoneCommand ? phoneCommand.phone : null;

  if (name === null || message === null || phone === null) {
    throw new Error("Events Missing");
  }
  return {
    name,
    message,
    phone,
  };
}
