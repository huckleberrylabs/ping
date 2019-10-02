import { injectable } from "inversify";
import {
  IEventHandler,
  Result,
  OK,
  INTERNAL_SERVER_ERROR,
  IEventRepository,
  ITextingClient,
} from "@huckleberryai/core";
import { ISendWidgetMessageCommand } from "./command";
import { WidgetMessageAggregate } from "../../aggregate";
import { IWidgetSettingsRepository } from "../../../settings/repository";

@injectable()
export class SendWidgetMessageCommandHandler implements IEventHandler {
  constructor(
    private settingsRepo: IWidgetSettingsRepository,
    private eventRepo: IEventRepository,
    private textingClient: ITextingClient
  ) {}
  async handle(event: ISendWidgetMessageCommand) {
    const origin = "48b5a544-1f33-48dd-badd-d0c523210004";
    const widgetSettings = await this.settingsRepo.getByID(event.widget);
    if (!widgetSettings) {
      return Result(
        `could not retrieve widgetsettings for id ${event.widget}`,
        INTERNAL_SERVER_ERROR,
        origin,
        event.corr,
        event.id
      );
    }
    const events = await this.eventRepo.getByCorrID(event.corr);
    if (!events) {
      return Result(
        `could not retrieve events for corr id ${event.corr}`,
        INTERNAL_SERVER_ERROR,
        origin,
        event.corr,
        event.id
      );
    }
    const { name, text, phone } = WidgetMessageAggregate(events);
    await this.textingClient.send(
      `New Message from ${name}: ${text}
		\n Reply to them at ${phone}`,
      widgetSettings.phone
    );
    await this.eventRepo.add(event);

    return Result(null, OK, origin, event.corr, event.id);
  }
}
