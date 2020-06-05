import { isLeft } from "fp-ts/lib/Either";
import { toUndefined, isSome } from "fp-ts/lib/Option";
import {
  Results,
  UUID,
  Env,
  NonEmptyString,
  EmailClient,
} from "@huckleberrylabs/core";
import { AccountRepository, BillingService } from "../../../interfaces";
import * as Account from "../../../account";
import * as Command from "../command";
import * as Event from "../event";

const ProductionPlan = "plan_GqR7YANPMgUe0h" as NonEmptyString.T;
const DevPlan = "plan_GqR9gjrsaG4vNV" as NonEmptyString.T;
const Plan = Env.Get() === "production" ? ProductionPlan : DevPlan;

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
    plan: Plan,
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
