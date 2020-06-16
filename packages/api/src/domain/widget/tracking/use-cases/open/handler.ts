import { Either } from "fp-ts/lib/Either";
import { IWidgetTrackingRepository } from "../../../../../interfaces";
import * as Command from "./command";
import * as Event from "../../events/opened";
import { Errors } from "@huckleberrylabs/core";

export type IHandler = (
  event: Command.T
) => Promise<Either<Errors.Adapter.T, null>>;

export default (repo: IWidgetTrackingRepository): IHandler => async command => {
  const event = Event.C(command.widget);
  const persistedMaybe = await repo.persist(event.widget, event);
  return persistedMaybe;
};
