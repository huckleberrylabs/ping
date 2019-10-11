import {
  Result,
  OK,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "@huckleberryai/core";
import { IWidgetSettingsRepository } from "../../../interfaces";
import { Query } from "./query";

export const Handler = (settingsRepo: IWidgetSettingsRepository) => async (
  query: Query
) => {
  try {
    const widgetSettings = await settingsRepo.get(query.widget);
    if (!widgetSettings) {
      return Result(null, NOT_FOUND, query.corr, query.id);
    }
    return Result(widgetSettings, OK, query.corr, query.id);
  } catch (error) {
    return Result(null, INTERNAL_SERVER_ERROR, query.corr, query.id);
  }
};
