import { UUID, Event } from "@huckleberryai/core";
import { IWidgetSettings } from "./settings/entity";
import { IWidgetMessage } from "./message";

export interface IWidgetSettingsRepository {
  add(widget: IWidgetSettings): Promise<void>;
  get(id: UUID): Promise<IWidgetSettings | null>;
}

export interface IWidgetMessageRepository {
  add(event: Event): Promise<void>;
  get(id: UUID): Promise<IWidgetMessage | null>;
  getEvent(id: UUID): Promise<Event | null>;
  getEventsByCorrID(corrID: UUID): Promise<Event[] | null>;
}
