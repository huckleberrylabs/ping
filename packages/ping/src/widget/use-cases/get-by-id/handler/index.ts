import { isLeft } from "fp-ts/lib/Either";
import { Results, Errors } from "@huckleberrylabs/core";
import { WidgetRepository } from "../../../../interfaces";
import * as Query from "../query";

export const Handler = (repo: WidgetRepository) => async (query: Query.T) => {
  const widgetMaybe = await repo.get(query.widget);
  if (isLeft(widgetMaybe)) {
    switch (widgetMaybe.left.type) {
      case Errors.NotFound.Name:
        return Results.NotFound.C(query);
      default:
        return Results.Error.C(query);
    }
  }
  const widget = widgetMaybe.right;
  return Results.OKWithData.C(query, widget, widget.type);
};
