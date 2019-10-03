import { UUID } from "@huckleberryai/core";
import { ILogEntryEvent } from "./log-entry-event";

export interface ILogEntryRepository {
  add(event: ILogEntryEvent): Promise<void>;
  get(id: UUID): Promise<ILogEntryEvent | null>;
  getByCorrID(corrID: UUID): Promise<ILogEntryEvent[] | null>;
}
