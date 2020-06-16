import { Either } from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberrylabs/core";
import * as Event from "../domain/value-objects/event";
import * as Opened from "../domain/widget/tracking/events/opened";
import * as Closed from "../domain/widget/tracking/events/closed";

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

export interface IWidgetTrackingRepository {
  persist: (
    id: UUID.T,
    events: Opened.T | Closed.T
  ) => Promise<Either<Errors.Adapter.T, null>>;
}
