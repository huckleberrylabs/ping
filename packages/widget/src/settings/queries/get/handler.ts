import { injectable, inject } from "inversify";
import {
  Result,
  IEventHandler,
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "@huckleberryai/core";
import { IWidgetGetSettingsQuery, IsWidgetGetSettingsQuery } from "./query";
import {
  IWidgetSettingsRepository,
  WidgetSettingsRepositoryType,
} from "../../../interfaces";

@injectable()
export class WidgetGetSettingsQueryHandler implements IEventHandler {
  constructor(
    @inject(WidgetSettingsRepositoryType)
    private settingsRepo: IWidgetSettingsRepository
  ) {}
  async handle(query: IWidgetGetSettingsQuery) {
    const ORIGIN_ID = "1aa5921c-68e8-4e30-86ac-40d0ce279796";
    if (!IsWidgetGetSettingsQuery(query)) {
      return Result(null, BAD_REQUEST, ORIGIN_ID);
    }
    try {
      const widgetSettings = await this.settingsRepo.get(query.widget);
      if (!widgetSettings) {
        return Result(null, NOT_FOUND, ORIGIN_ID, query.corr, query.id);
      }
      return Result(widgetSettings, OK, ORIGIN_ID, query.corr, query.id);
    } catch (error) {
      return Result(
        null,
        INTERNAL_SERVER_ERROR,
        ORIGIN_ID,
        query.corr,
        query.id
      );
    }
  }
}
