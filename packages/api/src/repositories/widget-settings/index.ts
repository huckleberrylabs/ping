import { injectable } from "inversify";
import { KebabCaseString } from "@huckleberryai/core";
import {
  IWidgetSettings,
  IsWidgetSettings,
  IWidgetSettingsRepository,
} from "@huckleberryai/widget";
import { add, get } from "../base";
import { DocumentStore } from "../../utilities";

@injectable()
export class WidgetSettingsRepository implements IWidgetSettingsRepository {
  private collection: KebabCaseString = "widget-settings";
  constructor(private store: DocumentStore) {}
  add = (widgetSettings: IWidgetSettings) =>
    add(this.store.store)(this.collection)(widgetSettings.id, widgetSettings);
  get = get(this.store.store)(this.collection)(IsWidgetSettings);
}
