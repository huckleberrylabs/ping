import { some, isSome, none } from "fp-ts/lib/Option";
import { isLeft } from "fp-ts/lib/Either";
import { Results } from "@huckleberryai/core";
import { AccountRepository } from "../../../../interfaces";
import * as Command from "../command";
import * as Event from "../event";

export const Handler = (repo: AccountRepository) => async (
  command: Command.T
) => {
  // TODO IsAuthorized
  const event = Event.C(command);
  const { email, userName, billingEmail, name } = event;
  const acccountMaybe = await repo.get(event.account);
  if (isLeft(acccountMaybe)) {
    switch (acccountMaybe.left.type) {
      case "core:error:not-found":
        return Results.NotFound.C(command);
      case "core:error:adapter":
      default:
        return Results.Error.C(command);
    }
  }
  const account = acccountMaybe.right;

  account.name = name;
  account.userName = userName;

  if (account.email !== email) {
    account.email = email;
    account.emailVerified = false;
    // TODO Send Verify Email
  }

  if (account.billingEmail !== billingEmail) {
    account.billingEmail = billingEmail;
    account.billingEmailVerified = isSome(billingEmail) ? some(false) : none;
    // TODO Send Verify Email
  }

  const saved = await repo.update(account);

  if (isLeft(saved)) {
    // TODO Clean up email verification
    return Results.Error.C(command);
  }

  return Results.OK.C(command);
};
