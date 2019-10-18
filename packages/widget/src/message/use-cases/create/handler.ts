import { MessageRepository } from "../../../interfaces";
import * as Command from "./command";
import * as Event from "./event";
import { isLeft } from "fp-ts/lib/Either";
import { Results, UUID } from "@huckleberryai/core";

export const Handler = (repo: MessageRepository) => async (
  command: Command.T
) => {
  const event = Event.C(command);
  const message = await repo.get(event.message);
  if (isLeft(message)) return Results.BadRequest.C(command);
  const saved = await repo.add(event.id, event);
  if (isLeft(saved)) return Results.Error.C(command);
  return Results.OKWithData.C(command, event.message, UUID.Name);
};
