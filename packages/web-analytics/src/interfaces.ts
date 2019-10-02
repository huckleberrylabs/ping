import { IEvent, UUID } from "@huckleberryai/core";

export interface IWebAnalyticsRepository {
  add(event: IEvent): Promise<void>;
  get(id: UUID): Promise<IEvent | null>;
  getByCorrID(corrID: UUID): Promise<IEvent[] | null>;
}
