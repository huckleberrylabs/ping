import { Either } from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberrylabs/core";
import * as WidgetTrackingEvents from "../domain/widget/tracking/events";

export interface IWidgetTrackingRepository {
  persist: (
    id: UUID.T,
    event:
      | WidgetTrackingEvents.Closed.T
      | WidgetTrackingEvents.Loaded.T
      | WidgetTrackingEvents.Opened.T
      | WidgetTrackingEvents.Unloaded.T
  ) => Promise<Either<Errors.Adapter.T, null>>;
}
