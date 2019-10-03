import { injectable } from "inversify";
import {
  IEventHandler,
  Result,
  OK,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  ITextingClient,
} from "@huckleberryai/core";
import {
  IWidgetSendMessageCommand,
  IsWidgetSendMessageCommand,
} from "./command";
import { WidgetMessageSentEventType } from "./event";
import { WidgetMessageAggregate, MessageIsReadyToSend } from "../../aggregate";
import {
  IWidgetSettingsRepository,
  IWidgetMessageRepository,
} from "../../../interfaces";

@injectable()
export class WidgetSendMessageCommandHandler implements IEventHandler {
  constructor(
    private settingsRepo: IWidgetSettingsRepository,
    private messageRepo: IWidgetMessageRepository,
    private textingClient: ITextingClient
  ) {}
  async handle(command: IWidgetSendMessageCommand) {
    const ORIGIN_ID = "48b5a544-1f33-48dd-badd-d0c523210004";
    if (!IsWidgetSendMessageCommand(command)) {
      return Result(null, BAD_REQUEST, ORIGIN_ID);
    }
    try {
      const widgetSettings = await this.settingsRepo.get(command.widget);
      const commands = await this.messageRepo.getEventsByCorrID(command.corr);

      // Widget and Message must exist
      if (!widgetSettings || !commands) {
        return Result(null, NOT_FOUND, ORIGIN_ID, command.corr, command.id);
      }

      const message = WidgetMessageAggregate(commands);

      // Message must be in correct state
      if (message.sent || !MessageIsReadyToSend(message)) {
        Result(null, BAD_REQUEST, ORIGIN_ID, command.corr, command.id);
      }

      await this.textingClient.send(
        `New Message from ${message.name}: ${message.text}
		    \n Reply to them at ${message.phone}`,
        widgetSettings.phone
      );

      // store as event
      const event = { ...command, type: WidgetMessageSentEventType };
      await this.messageRepo.add(event);

      return Result(null, OK, ORIGIN_ID, command.corr, command.id);
    } catch (error) {
      return Result(
        null,
        INTERNAL_SERVER_ERROR,
        ORIGIN_ID,
        command.corr,
        command.id
      );
    }
  }
}
