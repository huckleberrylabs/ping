import { isLeft } from "fp-ts/lib/Either";
import { Results, UUID, EmailClient } from "@huckleberryai/core";
import { AccountRepository, BillingService } from "../../../interfaces";
import * as Account from "../../../account";
import * as Command from "../command";
import * as Event from "../event";
import { toUndefined, isSome } from "fp-ts/lib/Option";

export const Handler = (
  repo: AccountRepository,
  billing: BillingService,
  email: EmailClient
) => async (command: Command.T) => {
  const event = Event.C(command);
  const stripeCustomerMaybe = await billing.createAccount({
    idemKey: command.id,
    email: isSome(command.billingEmail)
      ? command.billingEmail.value
      : command.email,
    accountName: toUndefined(command.name),
    userName: command.userName,
    paymentMethod: command.paymentMethod,
    promoCode: toUndefined(command.promoCode),
  });
  if (isLeft(stripeCustomerMaybe)) return Results.Error.C(command);
  const stripeCustomer = stripeCustomerMaybe.right;
  const account = Account.C(
    stripeCustomer,
    event.userName,
    event.email,
    event.billingEmail,
    event.name
  );
  const saved = await repo.add(account);
  if (isLeft(saved)) return Results.Error.C(command);
  return Results.OKWithData.C(command, account.id, UUID.Name);
};
