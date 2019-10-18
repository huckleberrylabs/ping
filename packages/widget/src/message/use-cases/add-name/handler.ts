import { MessageRepository } from "../../../interfaces";
import * as Command from "./command";
import * as Event from "./event";
import { isLeft } from "fp-ts/lib/Either";
import { Results } from "@huckleberryai/core";
import { isSome } from "fp-ts/lib/Option";

export const Handler = (repo: MessageRepository) => async (
  command: Command.T
) => {
  const res = await repo.get(command.message);
  if (isLeft(res)) return Results.Error.C(command);
  if (isSome(res.right.name)) return Results.BadRequest.C(command);
  const event = Event.C(command);
  const saved = await repo.add(event.id, event);
  if (isLeft(saved)) return Results.Error.C(command);
  return Results.OK.C(command);
};
