import {
  Result,
  IEventHandler,
  OK,
  NOT_FOUND,
  IEventRepository,
  StatusCode,
  Data,
} from "@huckleberryai/core";
import { IGetWidgetSettingsQuery } from "./query";
import { IWidgetSettingsRepository } from "../../repository";
import { injectable } from "inversify";

@injectable()
export class GetWidgetSettingsQueryHandler implements IEventHandler {
  public origin = "1aa5921c-68e8-4e30-86ac-40d0ce279796";
  constructor(
    private settingsRepo: IWidgetSettingsRepository,
    private eventRepo: IEventRepository
  ) {}
  async handle(event: IGetWidgetSettingsQuery) {
    let data: Data = "widget not found";
    let status: StatusCode = NOT_FOUND;
    await this.eventRepo.add(event);
    const widgetSettings = await this.settingsRepo.getByID(event.widget);
    if (widgetSettings) {
      data = widgetSettings;
      status = OK;
    }
    return Result(data, status, this.origin, event.corr, event.id);
  }
}
