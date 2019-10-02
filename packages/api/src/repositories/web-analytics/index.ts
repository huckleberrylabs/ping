import { injectable } from "inversify";
import { KebabCaseString, IsEvent } from "@huckleberryai/core";
import { IWebAnalyticsRepository } from "@huckleberryai/web-analytics";
import { DocumentStore } from "../../utilities";
import { add, get, getByProperty } from "../base";

@injectable()
export class WebAnalyticsRepository implements IWebAnalyticsRepository {
  private collection: KebabCaseString = "log-entries";
  constructor(private store: DocumentStore) {}
  add = add(this.store.store)(this.collection);
  getByID = get(this.store.store)(this.collection)(IsEvent);
  getByCorrID = getByProperty(this.store.store)(this.collection)(
    "corr",
    IsEvent
  );
}
