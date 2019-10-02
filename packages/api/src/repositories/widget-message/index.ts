import { injectable } from "inversify";
import { KebabCaseString, IsEvent, UUID } from "@huckleberryai/core";
import {
  IWidgetMessage,
  IWidgetMessageRepository,
  IsWidgetMessageCreatedEvent,
  WidgetMessageAggregate,
} from "@huckleberryai/widget";
import { DocumentStore } from "../../utilities";
import { add, get, getByProperty } from "../base";

@injectable()
export class WidgetMessageRepository implements IWidgetMessageRepository {
  private collection: KebabCaseString = "widget-message";
  constructor(private store: DocumentStore) {}
  getMessageByID = async (id: UUID): Promise<IWidgetMessage | null> => {
    const createdEvent = await this.getEventByID(id);
    if (!IsWidgetMessageCreatedEvent(createdEvent)) return null;
    const events = await this.getEventsByCorrID(id);
    return WidgetMessageAggregate(events);
  };
  addEvent = add(this.store.store)(this.collection);
  getEventByID = get(this.store.store)(this.collection)(IsEvent);
  getEventsByCorrID = getByProperty(this.store.store)(this.collection)(
    "corr",
    IsEvent
  );
}
