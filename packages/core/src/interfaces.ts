import { Either } from "fp-ts/lib/Either";
import * as Event from "./event";
import { Phone, NonEmptyString } from "./values";

export type IDispatch = (event: Event.T) => Promise<void>;
export type IHandler = (event: Event.T) => Promise<Either<Event.T, Event.T>>;
export type ISMSClient = (
  body: NonEmptyString.T,
  to: Phone.T
) => Promise<Either<Error, void>>;
