import { injectable } from "inversify";
import { KebabCaseString } from "@huckleberryai/core";
import { ILogEntryRepository, IsLogEntryEvent } from "@huckleberryai/log";
import { DocumentStore } from "../../utilities";
import { add, get, getByProperty } from "../base";

@injectable()
export class LogEntryRepository implements ILogEntryRepository {
  private collection: KebabCaseString = "log-entries";
  constructor(private store: DocumentStore) {}
  add = add(this.store.store)(this.collection);
  getByID = get(this.store.store)(this.collection)(IsLogEntryEvent);
  getByCorrID = getByProperty(this.store.store)(this.collection)(
    "corr",
    IsLogEntryEvent
  );
}
