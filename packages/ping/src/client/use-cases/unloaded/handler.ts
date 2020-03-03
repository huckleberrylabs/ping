import { isRight } from "fp-ts/lib/Either";
import { Results } from "@huckleberryai/core";
import { WebAnalyticsRepository } from "../../../interfaces";
import * as Command from "./command";
import * as Event from "./event";

export const Handler = (repo: WebAnalyticsRepository) => async (
  command: Command.T
) => {
  const events = [...command.log, Event.C(command)];
  const results = await Promise.all(
    events.map(event => repo.save(event.id, event))
  );
  // Its ok if this operation fails for some because its analytics data
  if (results.some(isRight)) return Results.OK.C(command);
  return Results.Error.C(command);
};
