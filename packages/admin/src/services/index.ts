import { AuthStates, AuthService } from "./auth";
import { AccountStates, AccountService } from "./account";
import { WidgetStates, WidgetService } from "./widget";
import { ContactStates, ContactService } from "./contact";
import { ConversationStates, ConversationService } from "./conversation";
import { RouterStates, RouterService } from "./router";
import { MessageStates, MessageService } from "./message";
import { AnalyticsStates, AnalyticsService } from "./analytics";

export {
  AuthStates,
  AccountStates,
  WidgetStates,
  ContactStates,
  ConversationStates,
  RouterStates,
  MessageStates,
  AnalyticsStates,
};
export const authService = new AuthService();
export const accountService = new AccountService(authService);
export const widgetService = new WidgetService(authService);
export const contactService = new ContactService(authService);
export const conversationService = new ConversationService(authService);
export const routerService = new RouterService(authService);
export const messageService = new MessageService(authService);
export const analyticsService = new AnalyticsService(authService);
