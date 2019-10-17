import {
  IDispatch,
  Results,
  NonEmptyString,
  ISMSClient,
} from "@huckleberryai/core";
import * as Command from "./command";
import * as Event from "./event";
import * as Message from "../../entity";

import { SettingsRepository, MessageRepository } from "../../../interfaces";
import { pipe } from "fp-ts/lib/pipeable";
import { left, right, map, flatten, mapLeft } from "fp-ts/lib/Either";

export const Handler = (dispatch: IDispatch) => (
  settingsRepo: SettingsRepository,
  messageRepo: MessageRepository,
  sms: ISMSClient
) => async (command: Command.T) =>
  pipe(
    await settingsRepo.get(command.widget),
    mapLeft(err => Results.NotFound.C(command)),
    map(async settings =>
      pipe(
        await messageRepo.get(command.message),
        mapLeft(err => Results.NotFound.C(command)),
        map(message =>
          Message.CanSend(message)
            ? right(message)
            : left(Results.BadRequest.C(command))
        ),
        flatten,
        map(
          async message =>
            await sms(
              `New Message from ${message.name}: ${message.text}
		           \n Reply to them at ${message.phone}` as NonEmptyString.T,
              settings.phone
            )
        ),
        map(() => Event.C(command)),
        map(dispatch),
        map(() => right(Results.OK.C(command))),
        mapLeft(() => Results.Error.C(command))
      )
    )
  );
