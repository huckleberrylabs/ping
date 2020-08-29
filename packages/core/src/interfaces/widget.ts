import { Either } from "fp-ts/lib/Either";
import { UUID, Errors } from "../values";
import * as Analytics from "../widget/analytics";
import * as Widget from "../widget/settings";
import { IRepository } from "./repository";

export interface IAnalyticsRepository {
  add: (
    widget: UUID.T,
    event: Analytics.Model.T
  ) => Promise<Either<Errors.Adapter.T, null>>;
  getByWidget(
    widget: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Analytics.Model.T[]>>;
}

export interface IWidgetRepository extends IRepository<Widget.Model.T> {
  getByAccount(
    account: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Widget.Model.T[]>>;
}
