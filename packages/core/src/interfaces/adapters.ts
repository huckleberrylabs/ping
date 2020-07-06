import { Twilio } from "twilio";
import { Either } from "fp-ts/lib/Either";
import { Event, Errors, NameSpaceCaseString, UUID } from "../values";
import { Firestore } from "@google-cloud/firestore";
import { MailDataRequired } from "@sendgrid/helpers/classes/mail";

export interface ITwilio extends Twilio {
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
}

export interface IFireStore extends Firestore {}

export type ISendGrid = (
  data: MailDataRequired
) => Promise<Either<Errors.Adapter.T, null>>;

export type ISubscriber = (
  event: Event.T
) => Promise<Either<Errors.Adapter.T, null>>;

export interface IEventBus {
  publish: (
    event: Event.T | Event.T[]
  ) => Promise<Either<Errors.Adapter.T, null>>;
  subscribe: (
    name: NameSpaceCaseString.T,
    subscriber: ISubscriber
  ) => Promise<Either<Errors.Adapter.T, null>>;
}

export interface IEventStore {
  getEventsByStreamID: (
    stream: UUID.T
  ) => Promise<
    Either<Errors.Adapter.T | Errors.NotFound.T, Event.SerializedT[]>
  >;
  persist: (
    stream: UUID.T,
    event: Event.T | Event.T[]
  ) => Promise<Either<Errors.Adapter.T, null>>;
}
