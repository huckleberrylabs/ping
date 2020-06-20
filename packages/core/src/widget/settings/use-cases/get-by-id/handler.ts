import { Either, isLeft, right } from "fp-ts/lib/Either";
import { Errors } from "../../../../values";
import { IWidgetRepository } from "../../../../interfaces";
import * as Query from "./query";
import * as Model from "../../model";

export type IHandler = (
  query: Query.T
) => Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Model.T>>;

export default (repo: IWidgetRepository): IHandler => async query => {
  // Retrieve the widget
  const widgetMaybe = await repo.get(query.widget);
  if (isLeft(widgetMaybe)) return widgetMaybe;
  const widget = widgetMaybe.right;
  return right(widget);
};
