import { UUID, IEvent } from "@huckleberryai/core";
import { IWidgetSettings } from "./settings/entity";
import { IWidgetMessage } from "./message";

export interface IWidgetSettingsRepository {
  add(widget: IWidgetSettings): Promise<void>;
  get(id: UUID): Promise<IWidgetSettings | null>;
}

export interface IWidgetMessageRepository {
  add(event: IEvent): Promise<void>;
  get(id: UUID): Promise<IWidgetMessage | null>;
  getEvent(id: UUID): Promise<IEvent | null>;
  getEventsByCorrID(corrID: UUID): Promise<IEvent[] | null>;
}
