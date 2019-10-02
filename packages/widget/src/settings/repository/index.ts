import { UUID } from "@huckleberryai/core";
import { IWidgetSettings } from "../entity";

export interface IWidgetSettingsRepository {
  add(widget: IWidgetSettings): Promise<void>;
  get(id: UUID): Promise<IWidgetSettings | null>;
}
