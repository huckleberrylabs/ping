import { IEvent, IResult } from "./base";
import { NonEmptyString, Phone, JSON } from "./values";

export interface IEventHandler {
  handle(event: IEvent): Promise<IResult<JSON>>;
}

export const TextingClientType = "texting-client";
export interface ITextingClient {
  send(body: NonEmptyString, to: Phone): Promise<void>;
}
