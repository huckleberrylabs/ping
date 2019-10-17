import { pipe } from "fp-ts/lib/pipeable";
import { fold } from "fp-ts/lib/Either";
import { Repository } from "../../../interfaces";
import * as Event from "./event";
import { Results } from "@huckleberryai/core";

export const Handler = (repo: Repository) => async (event: Event.T) =>
  pipe(
    await repo.save(event.id, event)(),
    fold(() => Results.Error.C(event), () => Results.OK.C(event))
  );
