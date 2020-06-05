import { isLeft } from "fp-ts/lib/Either";
import { Results, UUID, Errors } from "@huckleberrylabs/core";
import { AccountRepository, IAMService } from "../../../../interfaces";
import * as Command from "../command";
import * as Event from "../event";

export const Handler = (repo: AccountRepository, iam: IAMService) => async (
  command: Command.T
) => {
  const event = Event.C(command);
  const idMaybe = iam.getAgentFromToken(event.token);
  if (isLeft(idMaybe)) {
    // TODO log and notify engineer
    return Results.Error.C(command);
  }
  const id = idMaybe.right;
  const acccountMaybe = await repo.get(id);
  if (isLeft(acccountMaybe)) {
    switch (acccountMaybe.left.type) {
      case Errors.NotFound.Name:
        return Results.NotFound.C(command);
      case Errors.Adapter.Name:
      default:
        return Results.Error.C(command);
    }
  }
  const account = acccountMaybe.right;
  if (!account.emailVerified) {
    account.emailVerified = true;
    repo.update(account);
  }
  return Results.OKWithData.C(command, account.id, UUID.Name);
};
