import { UUID } from "@huckleberryai/core";
import { LogEntryEvent } from "./log-entry-event";

export interface ILogEntryRepository {
  add(event: LogEntryEvent): Promise<void>;
  get(id: UUID): Promise<LogEntryEvent | null>;
  getByCorrID(corrID: UUID): Promise<LogEntryEvent[] | null>;
}
