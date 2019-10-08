import { PersonName } from "@huckleberryai/core";
import { IWidgetEvent } from "../../../base/event";

export const WidgetNameAddedToMessageEventType =
  "widget-name-added-to-message-event";

export interface IWidgetNameAddedToMessageEvent extends IWidgetEvent {
  name: PersonName;
}
