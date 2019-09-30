import { IEvent, IResult } from "../entities";
import { UUID, NonEmptyString, Phone, Data } from "../values";

export interface IEventHandler {
  origin: UUID;
  handle(event: IEvent): Promise<IResult<Data>>;
}

export interface IEventRepository {
  add(event: IEvent): Promise<void>;
  getByID(id: UUID): Promise<IEvent | null>;
  getByCorrID(corrID: UUID): Promise<IEvent[] | null>;
}

export interface ITextingClient {
  send(body: NonEmptyString, to: Phone): Promise<void>;
}
