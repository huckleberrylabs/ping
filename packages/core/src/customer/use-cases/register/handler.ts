import { Either, isRight, left, isLeft, right } from "fp-ts/lib/Either";
import { Errors, UUID } from "../../../values";
import {
  IAccountRepository,
  IWidgetRepository,
  IRouterRepository,
  IMessagingService,
  IBillingService,
  IAuthorizationService,
  IContactRepository,
} from "../../../interfaces";
import * as Command from "./command";
import { Account } from "../../../iam";
import { Contact, Router } from "../../../messaging";
import * as Widget from "../../../widget";
import { toUndefined } from "fp-ts/lib/Option";

export type IHandler = (
  command: Command.T
) => Promise<Either<Errors.Adapter.T | Errors.Validation.T, UUID.T>>;

export default (
  accountRepo: IAccountRepository,
  widgetRepo: IWidgetRepository,
  contactRepo: IContactRepository,
  routerRepo: IRouterRepository,
  messagingService: IMessagingService,
  billingService: IBillingService,
  auth: IAuthorizationService
): IHandler => async command => {
  // Check if account with same email already exists
  const accountMaybe = await accountRepo.getByEmail(command.email);
  if (isRight(accountMaybe)) {
    return left(
      Errors.Validation.C(
        Command.Name,
        `account with email ${command.email} already exists.`,
        "An account already exists under that email."
      )
    );
  }

  const billingMaybe = await billingService.createAccount({
    idemKey: command.id,
    email: command.email,
    promoCode: toUndefined(command.promoCode),
  });
  if (isLeft(billingMaybe)) return billingMaybe;

  const account = Account.Model.C(command.email, billingMaybe.right);
  const accountSavedMaybe = await accountRepo.add(account);
  if (isLeft(accountSavedMaybe)) return accountSavedMaybe;

  // Grant Authorization for account on itself
  await auth.grant({
    account: account.id,
    entity: account.id,
  });

  const contact = Contact.Model.C(account.id, true, command.phone);
  const contactSavedMaybe = await contactRepo.add(contact);
  if (isLeft(contactSavedMaybe)) return contactSavedMaybe;

  // Grant Authorization for account on contact
  await auth.grant({
    account: account.id,
    entity: contact.id,
  });

  const widget = Widget.Settings.Model.C(account.id, command.website);
  const widgetSavedMaybe = await widgetRepo.add(widget);
  if (isLeft(widgetSavedMaybe)) return widgetSavedMaybe;

  // Grant Authorization for account on widget
  await auth.grant({
    account: account.id,
    entity: widget.id,
  });

  const router = Router.Model.C(account.id);
  // @ts-ignore
  router.routes[widget.id] = contact.id;
  const routerSavedMaybe = await routerRepo.add(router);
  if (isLeft(routerSavedMaybe)) return routerSavedMaybe;

  // Grant Authorization for account on router
  await auth.grant({
    account: account.id,
    entity: router.id,
  });

  await messagingService.createChannel(account.id, UUID.C(), "sms");
  await messagingService.createChannel(account.id, widget.id, "widget");

  return right(widget.id);
};
