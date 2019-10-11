import {
  IDispatch,
  Result,
  OK,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  ISMSClient,
  NonEmptyString,
} from "@huckleberryai/core";
import { Command } from "./command";
import { Event } from "./event";
import { MessageIsReadyToSend } from "../../domain";
import {
  IWidgetSettingsRepository,
  IWidgetMessageRepository,
} from "../../../interfaces";

export const Handler = (dispatch: IDispatch) => (
  settingsRepo: IWidgetSettingsRepository,
  messageRepo: IWidgetMessageRepository,
  sms: ISMSClient
) => async (command: Command) => {
  try {
    const widgetSettings = await settingsRepo.get(command.widget);
    const message = await messageRepo.getMessageByID(command.message);

    // Widget and Message must exist
    if (!widgetSettings || !message) {
      return Result(null, NOT_FOUND, command.corr, command.id);
    }

    // Message must be in correct state
    if (message.sent || !MessageIsReadyToSend(message)) {
      Result(null, BAD_REQUEST, command.corr, command.id);
    }

    await sms(
      `New Message from ${message.name}: ${message.text}
		    \n Reply to them at ${message.phone}` as NonEmptyString,
      widgetSettings.phone
    );

    // store as event
    const event = Event(command);
    await dispatch(event);

    return Result(null, OK, command.corr, command.id);
  } catch (error) {
    return Result(null, INTERNAL_SERVER_ERROR, command.corr, command.id);
  }
};
