import { Either } from "fp-ts/lib/Either";
import { UUID, Errors } from "../values";
import * as Analytics from "../widget/analytics";
import * as Widget from "../widget/settings";
import * as Logging from "../widget/logging";

export interface IAnalyticsRepository {
  add: (
    widget: UUID.T,
    event: Analytics.Model.T
  ) => Promise<Either<Errors.Adapter.T, null>>;
}

export interface IWidgetRepository {
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Widget.Model.T>>;
  add(widget: Widget.Model.T): Promise<Either<Errors.Adapter.T, null>>;
  remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
  update(
    widget: Widget.Model.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
  exists(
    id: UUID.T
  ): Promise<
    Either<Errors.Adapter.T | Errors.NotImplemented.T | Errors.NotFound.T, null>
  >;
}

export type ILogger = (
  level: Logging.Level.T,
  message: string,
  tags: string[],
  parent?: UUID.T
) => void;
