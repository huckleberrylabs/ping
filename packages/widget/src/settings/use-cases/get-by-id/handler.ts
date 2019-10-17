import { pipe } from "fp-ts/lib/pipeable";
import { map, mapLeft, right } from "fp-ts/lib/Either";
import { Results } from "@huckleberryai/core";
import { SettingsRepository } from "../../../interfaces";
import * as Query from "./query";
import { flatten } from "fp-ts/lib/Either";

export const Handler = (repo: SettingsRepository) => async (query: Query.T) =>
  pipe(
    await repo.get(query.widget),
    map(settings => right(Results.OK.C(query))),
    flatten,
    mapLeft(err => Results.Error.C(query))
  );
