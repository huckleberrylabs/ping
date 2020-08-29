import { Either, isLeft, right, isRight } from "fp-ts/lib/Either";
import { Errors } from "../../../values";
import {
  IAccountRepository,
  IWidgetRepository,
  IRouterRepository,
  IBillingService,
  IContactRepository,
  IMessageRepository,
  IConversationRepository,
  IChannelRepository,
} from "../../../interfaces";
import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<
  Either<Errors.Adapter.T | Errors.Validation.T | Errors.NotFound.T, null>
>;

export default (
  accountRepo: IAccountRepository,
  widgetRepo: IWidgetRepository,
  convoRepo: IConversationRepository,
  contactRepo: IContactRepository,
  routerRepo: IRouterRepository,
  messageRepo: IMessageRepository,
  channelRepo: IChannelRepository,
  billingService: IBillingService
): IHandler => async command => {
  const accountMaybe = await accountRepo.get(command.account);
  if (isLeft(accountMaybe)) return accountMaybe;

  const account = accountMaybe.right;

  const billingMaybe = await billingService.closeAccount({
    idemKey: command.id,
    customer: account.customer,
  });
  if (isLeft(billingMaybe)) return billingMaybe;

  const widgetsMaybe = await widgetRepo.getByAccount(account.id);
  if (isRight(widgetsMaybe)) {
    const widgets = widgetsMaybe.right;
    widgets.forEach(w => {
      widgetRepo.remove(w.id);
    });
  }

  const conversationsMaybe = await convoRepo.getByAccount(account.id);
  if (isRight(conversationsMaybe)) {
    const conversations = conversationsMaybe.right;
    conversations.forEach(c => {
      convoRepo.remove(c.id);
    });
  }

  const messagesMaybe = await messageRepo.getByAccount(account.id);
  if (isRight(messagesMaybe)) {
    const messages = messagesMaybe.right;
    messages.forEach(m => {
      messageRepo.remove(m.id);
    });
  }

  const contactsMaybe = await contactRepo.getByAccount(account.id);
  if (isRight(contactsMaybe)) {
    const contacts = contactsMaybe.right;
    contacts.forEach(c => {
      contactRepo.remove(c.id);
    });
  }

  const channelsMaybe = await channelRepo.getByAccount(account.id);
  if (isRight(channelsMaybe)) {
    const channels = channelsMaybe.right;
    channels.forEach(c => {
      channelRepo.remove(c.id);
    });
  }

  const routerMaybe = await routerRepo.remove(account.id);
  if (isLeft(routerMaybe)) return routerMaybe;

  accountRepo.remove(account.id);

  return right(null);
};
