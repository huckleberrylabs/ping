import {
  UUID,
  Result,
  IEventHandler,
  OK,
  NOT_FOUND,
  MessageName,
} from "@huckleberryai/core";
import { ITextWidgetSettingsQuery } from "@huckleberryai/text";
import { EventRepository } from "../repositories/event-repository";
import { TextWidgetSettingsRepository } from "../repositories/widget-repository";
import { injectable } from "inversify";

@injectable()
export class TextWidgetSettingsQueryHandler implements IEventHandler {
  public id = UUID("1aa5921c-68e8-4e30-86ac-40d0ce279796");
  constructor(
    private settingsRepo: TextWidgetSettingsRepository,
    private eventRepo: EventRepository
  ) {}
  async handle(event: ITextWidgetSettingsQuery) {
    await this.eventRepo.add(event);
    const widgetSettings = await this.settingsRepo.getByID(event.widget);
    if (widgetSettings) {
      return Result(
        widgetSettings,
        widgetSettings.type,
        OK,
        this.id,
        event.corr,
        event.id
      );
    } else {
      return Result(
        "widget not found",
        MessageName,
        NOT_FOUND,
        this.id,
        event.corr,
        event.id
      );
    }
  }
}
