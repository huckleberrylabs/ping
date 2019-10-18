import { isRight } from "fp-ts/lib/Either";
import { Repository } from "../../../interfaces";
import * as Event from "./event";
import { Results } from "@huckleberryai/core";

export const Handler = (repo: Repository) => async (event: Event.T) =>
  isRight(await repo.save(event.id, event))
    ? Results.OK.C(event)
    : Results.Error.C(event);
