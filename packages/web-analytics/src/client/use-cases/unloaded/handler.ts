import { isRight } from "fp-ts/lib/Either";
import { Results } from "@huckleberryai/core";
import { Repository } from "../../../interfaces";
import * as Event from "./event";

export const Handler = (repo: Repository) => async (event: Event.T) => {
  const events = [...event.log, Event.Normalize(event)];
  const results = await Promise.all(
    events.map(event => repo.save(event.id, event))
  );
  // Its ok if this operation fails for some because its analytics data
  if (results.some(isRight)) return Results.OK.C(event);
  return Results.Error.C(event);
};
