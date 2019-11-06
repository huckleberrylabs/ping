import { isSome } from "fp-ts/lib/Option";
import { isLeft } from "fp-ts/lib/Either";
import {
  Results,
  NonEmptyString,
  SMSClient,
  PersonName,
  Errors,
} from "@huckleberryai/core";
import { WidgetRepository, MessageRepository } from "../../../../interfaces";
import * as Message from "../../../entity";
import * as Command from "../command";
import * as Event from "../event";

export const Handler = (
  widgetRepo: WidgetRepository,
  messageRepo: MessageRepository,
  sms: SMSClient
) => async (command: Command.T) => {
  const widgetMaybe = await widgetRepo.get(command.widget);
  if (isLeft(widgetMaybe)) {
    switch (widgetMaybe.left.type) {
      case Errors.NotFound.Name:
        return Results.NotFound.C(command);
      default:
        return Results.Error.C(command);
    }
  }
  const widget = widgetMaybe.right;
  const messageMaybe = await messageRepo.get(command.message);
  if (isLeft(messageMaybe)) {
    switch (messageMaybe.left.type) {
      case Errors.NotFound.Name:
        return Results.NotFound.C(command);
      default:
        return Results.Error.C(command);
    }
  }
  const message = messageMaybe.right;
  if (!Message.CanSend(message)) return Results.BadRequest.C(command);
  const sent = Event.C(command);
  const saved = await messageRepo.add(sent);
  if (isLeft(saved)) return Results.Error.C(command);
  const text = Message.Text(message);
  const phone = Message.Phone(message);
  const name = Message.PersonName(message);
  if (!name || !phone || !text) return Results.BadRequest.C(command);
  const printName = (name: PersonName.T) =>
    isSome(name.first) || isSome(name.last)
      ? `${isSome(name.first) ? name.first.value : ""} ${
          isSome(name.last) ? name.last.value : ""
        }`
      : "anonymous";
  const res = await sms(
    `You have a new message from ping:\n
    
    Name: ${printName(name)}\n
    
    Message: ${text}\n
    
    Reply to them at ${phone}` as NonEmptyString.T,
    widget.phone
  );
  if (isLeft(res)) {
    const removed = await messageRepo.remove(sent.id);
    if (isLeft(removed)) {
      console.error(
        `couldn't rollback saved event ${sent.id} in message repository`
      );
    }
    return Results.Error.C(command);
  }
  return Results.OK.C(command);
};
