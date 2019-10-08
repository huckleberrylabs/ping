import { Either } from "fp-ts/lib/Either";
import { NonEmptyString } from "io-ts-types/lib/NonEmptyString";
import { Event } from "./base";
import { Phone } from "./values";

export type IDispatch = (event: Event) => Promise<void>;
export type IHandler = (event: Event) => Promise<Either<Event, Event>>;
export type ISMSClient = (
  body: NonEmptyString,
  to: Phone
) => Promise<Either<Error, void>>;
