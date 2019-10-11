// @ts-ignore
import * as iots from "io-ts";
import { pipe } from "fp-ts/lib/pipeable";
import { map, right, left, mapLeft } from "fp-ts/lib/Either";
import { isSome } from "fp-ts/lib/Option";
import { Result, StatusCode } from "@huckleberryai/core";
import { SettingsRepository } from "../../../interfaces";
import * as Query from "./query";

export const Handler = (repo: SettingsRepository) => async (query: Query.T) =>
  pipe(
    await repo.get(query.widget),
    map(settings =>
      isSome(settings)
        ? right(Result(settings, StatusCode.OK, query.corr, query.id))
        : left(Result(null, StatusCode.NOT_FOUND, query.corr, query.id))
    ),
    mapLeft(err =>
      Result(null, StatusCode.INTERNAL_SERVER_ERROR, query.corr, query.id)
    )
  );
