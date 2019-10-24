import { isLeft } from "fp-ts/lib/Either";
import { Results } from "@huckleberryai/core";
import { MessageRepository } from "../../../../interfaces";
import * as Message from "../../../entity";
import * as Command from "../command";
import * as Event from "../event";

export const Handler = (repo: MessageRepository) => async (
  command: Command.T
) => {
  const messageMaybe = await repo.get(command.message);
  if (isLeft(messageMaybe)) return Results.Error.C(command);
  const message = messageMaybe.right;
  if (Message.Text(message)) return Results.BadRequest.C(command);
  const event = Event.C(command);
  const saved = await repo.add(event);
  if (isLeft(saved)) return Results.Error.C(command);
  return Results.OK.C(command);
};
