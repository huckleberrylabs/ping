// @ts-ignore
import * as iots from "io-ts";
import { isLeft } from "fp-ts/lib/Either";
import { Results } from "@huckleberryai/core";
import { SettingsRepository } from "../../../interfaces";
import * as Query from "./query";

export const Handler = (repo: SettingsRepository) => async (query: Query.T) => {
  const settings = await repo.get(query.widget);
  if (isLeft(settings)) {
    switch (settings.left.type) {
      case "core:error:not-found":
        return Results.NotFound.C(query);
      case "core:error:adapter":
      default:
        return Results.Error.C(query);
    }
  }
  return Results.OKWithData.C(query, settings.right, settings.right.type);
};
