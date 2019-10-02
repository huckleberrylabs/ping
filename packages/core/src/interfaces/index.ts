import { IEvent, IResult } from "../entities";
import { NonEmptyString, Phone, JSON } from "../values";

export interface IEventHandler {
  handle(event: IEvent): Promise<IResult<JSON>>;
}

export interface ITextingClient {
  send(body: NonEmptyString, to: Phone): Promise<void>;
}
