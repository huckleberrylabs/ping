import { UUID, Event } from "@huckleberryai/core";
import { WidgetSettings } from "./settings/entity";
import { WidgetMessage } from "./message/domain";

export interface IWidgetSettingsRepository {
  add(widget: WidgetSettings): Promise<void>;
  get(id: UUID): Promise<WidgetSettings | null>;
}

export interface IWidgetMessageRepository {
  add(event: Event): Promise<void>;
  get(id: UUID): Promise<WidgetMessage | null>;
  getEvent(id: UUID): Promise<Event | null>;
  getEventsByCorrID(corrID: UUID): Promise<Event[] | null>;
}
