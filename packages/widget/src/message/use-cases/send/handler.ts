import { isLeft } from "fp-ts/lib/Either";
import { Results, NonEmptyString, ISMSClient } from "@huckleberryai/core";
import { SettingsRepository, MessageRepository } from "../../../interfaces";
import * as Message from "../../entity";
import * as Command from "./command";
import * as Event from "./event";

export const Handler = (
  settingsRepo: SettingsRepository,
  messageRepo: MessageRepository,
  sms: ISMSClient
) => async (command: Command.T) => {
  const settings = await settingsRepo.get(command.widget);
  if (isLeft(settings)) {
    switch (settings.left.type) {
      case "core:error:not-found":
        return Results.NotFound.C(command);
      case "core:error:adapter":
      default:
        return Results.Error.C(command);
    }
  }
  const message = await messageRepo.get(command.message);
  if (isLeft(message)) {
    switch (message.left.type) {
      case "core:error:not-found":
        return Results.NotFound.C(command);
      case "core:error:adapter":
      default:
        return Results.Error.C(command);
    }
  }
  if (!Message.CanSend(message.right)) return Results.BadRequest.C(command);
  const msg = message.right;

  const sent = Event.C(command);
  const saved = await messageRepo.add(sent.id, sent);
  if (isLeft(saved)) return Results.Error.C(command);

  const res = await sms(
    `New Message from ${Message.Name(msg).first} ${
      Message.Name(msg).last
    }: ${Message.Text(msg)}\n Reply to them at ${Message.Phone(
      msg
    )}` as NonEmptyString.T,
    settings.right.phone
  );
  if (isLeft(res)) {
    const deleted = await messageRepo.delete(sent.id);
    if (isLeft(deleted)) {
      console.error(
        `couldn't rollback saved event ${sent.id} in message repository`
      );
    }
    return Results.Error.C(command);
  }
  return Results.OK.C(command);
};
