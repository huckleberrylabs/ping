import { injectable } from "inversify";
import { KebabCaseString } from "@huckleberryai/core";
import {
  IsWidgetSettings,
  IWidgetSettingsRepository,
} from "@huckleberryai/widget";
import { add, get } from "../base";
import { DocumentStore } from "../../utilities";

@injectable()
export class WidgetSettingsRepository implements IWidgetSettingsRepository {
  private collection: KebabCaseString = "text-widget-settings";
  constructor(private store: DocumentStore) {}
  add = add(this.store.store)(this.collection);
  get = get(this.store.store)(this.collection)(IsWidgetSettings);
}
