import { isRight } from "fp-ts/lib/Either";
import { Results } from "@huckleberrylabs/core";
import { WebAnalyticsRepository } from "../../../interfaces";
import * as Event from "./event";

export const Handler = (repo: WebAnalyticsRepository) => async (
  event: Event.T
) =>
  isRight(await repo.save(event.id, event))
    ? Results.OK.C(event)
    : Results.Error.C(event);
