import { injectable } from "inversify";
import { KebabCaseString, IEvent, IsEvent } from "@huckleberryai/core";
import { IWebAnalyticsRepository } from "@huckleberryai/web-analytics";
import { DocumentStore } from "../../utilities";
import { add, get, getByProperty } from "../base";

@injectable()
export class WebAnalyticsRepository implements IWebAnalyticsRepository {
  private collection: KebabCaseString = "web-analytics";
  constructor(private store: DocumentStore) {}
  add = (event: IEvent) =>
    add(this.store.store)(this.collection)(event.id, event);
  get = get(this.store.store)(this.collection)(IsEvent);
  getByCorrID = getByProperty(this.store.store)(this.collection)(
    "corr",
    IsEvent
  );
}
