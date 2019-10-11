import { injectable } from "inversify";
import { KebabCaseString } from "@huckleberryai/core";
import {
  ILogEntryRepository,
  ILogEntryEvent,
  IsLogEntryEvent,
} from "@huckleberryai/log";
import { DocumentStore } from "../../utilities";
import { add, get, getByProperty } from "../base";

@injectable()
export class LogEntryRepository implements ILogEntryRepository {
  private collection: KebabCaseString.T = "log-entries";
  constructor(private store: DocumentStore) {}
  add = (event: ILogEntryEvent) =>
    add(this.store.store)(this.collection)(event.id, event);
  get = get(this.store.store)(this.collection)(IsLogEntryEvent);
  getByCorrID = getByProperty(this.store.store)(this.collection)(
    "corr",
    IsLogEntryEvent
  );
}
