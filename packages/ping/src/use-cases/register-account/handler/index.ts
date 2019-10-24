import { isLeft } from "fp-ts/lib/Either";
import { Results, UUID } from "@huckleberryai/core";
import { AccountRepository } from "../../../interfaces";
import * as Account from "../../../account";
import * as Command from "../command";
import * as Event from "../event";

export const Handler = (repo: AccountRepository) => async (
  command: Command.T
) => {
  const event = Event.C(command);
  /* 
    - create stripe customer 
    - send email
  */
  const stripeCustomerID = "" as UUID.T;
  const account = Account.C(
    stripeCustomerID,
    event.userName,
    event.email,
    event.billingEmail,
    event.name
  );
  const saved = await repo.add(account);
  if (isLeft(saved)) return Results.Error.C(command);
  return Results.OKWithData.C(command, account.id, UUID.Name);
};
