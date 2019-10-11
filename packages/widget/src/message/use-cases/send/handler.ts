// @ts-ignore
import * as iots from "io-ts";
import {
  IDispatch,
  Result,
  StatusCode,
  NonEmptyString,
  ISMSClient,
} from "@huckleberryai/core";
import * as Command from "./command";
import * as Event from "./event";
import * as Message from "../../entity";

import { SettingsRepository, MessageRepository } from "../../../interfaces";
import { pipe } from "fp-ts/lib/pipeable";
import { left, right, map, flatten, mapLeft } from "fp-ts/lib/Either";
import { isSome } from "fp-ts/lib/Option";

export const Handler = (dispatch: IDispatch) => (
  settingsRepo: SettingsRepository,
  messageRepo: MessageRepository,
  sms: ISMSClient
) => async (command: Command.T) =>
  pipe(
    await settingsRepo.get(command.widget),
    map(settings =>
      isSome(settings)
        ? right(settings.value)
        : left(Result(null, StatusCode.NOT_FOUND, command.corr, command.id))
    ),
    flatten,
    map(async settings =>
      pipe(
        await messageRepo.get(command.message),
        map(message =>
          isSome(message)
            ? right(message.value)
            : left(Result(null, StatusCode.NOT_FOUND, command.corr, command.id))
        ),
        flatten,
        map(message =>
          Message.CanSend(message)
            ? right(message)
            : left(
                Result(null, StatusCode.BAD_REQUEST, command.corr, command.id)
              )
        ),
        flatten,
        map(async message => {
          await sms(
            `New Message from ${message.name}: ${message.text}
		           \n Reply to them at ${message.phone}` as NonEmptyString.T,
            settings.phone
          );
        }),
        map(() => Event.C(command)),
        map(dispatch),
        map(() => right(Result(null, StatusCode.OK, command.corr, command.id))),
        mapLeft(() =>
          Result(
            null,
            StatusCode.INTERNAL_SERVER_ERROR,
            command.corr,
            command.id
          )
        )
      )
    )
  );
