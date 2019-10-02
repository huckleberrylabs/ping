import { UUID } from "@huckleberryai/core";
import { ILogEntryEvent } from "./log-event";

export interface ILogEntryRepository {
  add<ILogEntryEvent>(event: ILogEntryEvent): Promise<void>;
  get(id: UUID): Promise<ILogEntryEvent | null>;
  getByCorrID(corrID: UUID): Promise<ILogEntryEvent[] | null>;
}
