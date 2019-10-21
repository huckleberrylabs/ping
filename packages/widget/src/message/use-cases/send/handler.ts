// @ts-ignore
import * as iots from "io-ts";
import { isLeft } from "fp-ts/lib/Either";
import {
  Results,
  NonEmptyString,
  SMSClient,
  PersonName,
} from "@huckleberryai/core";
import { SettingsRepository, MessageRepository } from "../../../interfaces";
import * as Message from "../../entity";
import * as Command from "./command";
import * as Event from "./event";
import { isSome } from "fp-ts/lib/Option";

export const Handler = (
  settingsRepo: SettingsRepository,
  messageRepo: MessageRepository,
  sms: SMSClient
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
  const text = Message.Text(msg);
  const phone = Message.Phone(msg);
  const name = Message.Name(msg);
  if (!name || !phone || !text) return Results.BadRequest.C(command);
  const printName = (name: PersonName.T) =>
    isSome(name.first) || isSome(name.last)
      ? `${isSome(name.first) ? name.first.value : ""} ${
          isSome(name.last) ? name.last.value : ""
        }`
      : "anonymous";
  const res = await sms(
    `New Message from ${printName(
      name
    )}: ${text}\n Reply to them at ${phone}` as NonEmptyString.T,
    settings.right.phone
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
