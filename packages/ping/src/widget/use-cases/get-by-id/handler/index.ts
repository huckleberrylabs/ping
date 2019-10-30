import { isLeft } from "fp-ts/lib/Either";
import { Results } from "@huckleberryai/core";
import { WidgetRepository } from "../../../../interfaces";
import * as Query from "../query";

// TODO return simple settings (stripped of PII like Phone Numbers)

export const Handler = (repo: WidgetRepository) => async (query: Query.T) => {
  const widgetMaybe = await repo.get(query.widget);
  if (isLeft(widgetMaybe)) {
    switch (widgetMaybe.left.type) {
      case "core:error:not-found":
        return Results.NotFound.C(query);
      case "core:error:adapter":
      default:
        return Results.Error.C(query);
    }
  }
  const widget = widgetMaybe.right;
  return Results.OKWithData.C(query, widget, widget.type);
};
