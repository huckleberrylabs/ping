import { Either } from "fp-ts/lib/Either";
import { Event } from "./base";
import { Phone, NonEmptyString } from "./values";

export type IDispatch = (event: Event) => Promise<void>;
export type IHandler = (event: Event) => Promise<Either<Event, Event>>;
export type ISMSClient = (
  body: NonEmptyString,
  to: Phone
) => Promise<Either<Error, void>>;
