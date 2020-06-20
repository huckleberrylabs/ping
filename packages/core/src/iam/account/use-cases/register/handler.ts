import { Either, isRight, left } from "fp-ts/lib/Either";
import { Errors } from "../../../../values";
import { IAccountRepository, IEventBus } from "../../../../interfaces";
import * as Model from "../../model";
import * as Command from "./command";
import * as Event from "../../events/registered";

/* const ProductionPlan = "plan_GqR7YANPMgUe0h" as NonEmptyString.T;
const DevPlan = "plan_GqR9gjrsaG4vNV" as NonEmptyString.T;
const Plan = Env.Get() === "production" ? ProductionPlan : DevPlan; */

/*   // Create a Billing Account
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
  if (isLeft(stripeCustomerMaybe)) {
    console.log("billing account could not be created");
    return stripeCustomerMaybe;
  }
  const stripeCustomer = stripeCustomerMaybe.right;
 */

export type IHandler = (
  command: Command.T
) => Promise<Either<Errors.Adapter.T | Errors.Validation.T, null>>;

export default (
  repo: IAccountRepository,
  bus: IEventBus
): IHandler => async command => {
  // Check if account with same email already exists
  const accountMaybe = await repo.getByEmail(command.email);
  if (isRight(accountMaybe)) {
    console.log("account with email already exists");
    return left(Errors.Validation.C());
  }

  // Create an account
  const account = Model.C(command.email, command.name);

  // Save the account
  const savedMaybe = await repo.add(account);

  // Publish event
  if (isRight(savedMaybe)) bus.publish(Event.C(account.id, command));

  return savedMaybe;
};
