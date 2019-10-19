import { injectable } from "inversify";
import { staticImplements } from "../../helpers";
import { IEventHandlerStatic, IEventHandler } from "../../interfaces";
import { EmailRepository } from "./repository";
import { SMTP, Logger } from "../../utilities";
import {
  EmailSendAction,
  EmailProcessedEvent,
  EmailDroppedEvent,
  EmailDeliveredEvent,
  EmailDeferredEvent,
  EmailOpenedEvent,
  EmailUnsubscribedEvent,
  EmailBouncedEvent,
  EmailSpamEvent,
  EmailReceivedEvent,
} from ".";

@injectable()
@staticImplements<IEventHandlerStatic>()
export class EmailSendActionHandler implements IEventHandler {
  constructor(
    private repository: EmailRepository,
    private smtp: SMTP,
    private logger: Logger
  ) {}
  async handle(action: EmailSendAction) {
    try {
      const headers: { [key: string]: string } = {};
      headers["X-Rotaru-EmailID"] = action.emailID;
      if (action.corrID) {
        headers["X-Rotaru-CorrID"] = action.corrID;
      }
      if (action.parentID) {
        headers["X-Rotaru-ParentID"] = action.parentID;
      }
      if (action.inReplyTo) {
        headers["In-Reply-To"] = action.inReplyTo;
      }
      await this.smtp.send(
        {
          to: action.to,
          cc: action.cc,
          bcc: action.bcc,
          from: action.from,
          replyTo: action.replyTo,
          subject: action.subject,
          text: action.text,
          html: action.html,
          attachments: action.attachments,
          headers: headers,
          customArgs: {
            rotaruEmailID: action.emailID,
            rotaruCorrID: action.corrID,
            rotaruParentID: action.parentID,
          },
          trackingSettings: {
            clickTracking: {
              enable: false,
            },
            openTracking: {
              enable: false,
            },
            subscriptionTracking: {
              enable: true,
            },
          },
        },
        false
      );
      // this.repository.save(action);
    } catch (error) {
      this.logger.log("error", error);
    }
  }
  public static get type() {
    return EmailSendAction.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class EmailProcessedEventHandler implements IEventHandler {
  async handle(event: EmailProcessedEvent) {
    return;
  }
  public static get type() {
    return EmailProcessedEvent.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class EmailDroppedEventHandler implements IEventHandler {
  async handle(event: EmailDroppedEvent) {
    return;
  }
  public static get type() {
    return EmailDroppedEvent.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class EmailDeliveredEventHandler implements IEventHandler {
  async handle(event: EmailDeliveredEvent) {
    return;
  }
  public static get type() {
    return EmailDeliveredEvent.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class EmailDeferredEventHandler implements IEventHandler {
  async handle(event: EmailDeferredEvent) {
    return;
  }
  public static get type() {
    return EmailDeferredEvent.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class EmailOpenedEventHandler implements IEventHandler {
  async handle(event: EmailOpenedEvent) {
    return;
  }
  public static get type() {
    return EmailOpenedEvent.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class EmailUnsubscribedEventHandler implements IEventHandler {
  async handle(event: EmailUnsubscribedEvent) {
    return;
  }
  public static get type() {
    return EmailUnsubscribedEvent.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class EmailBouncedEventHandler implements IEventHandler {
  async handle(event: EmailBouncedEvent) {
    return;
  }
  public static get type() {
    return EmailBouncedEvent.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class EmailSpamEventHandler implements IEventHandler {
  async handle(event: EmailSpamEvent) {
    return;
  }
  public static get type() {
    return EmailSpamEvent.type;
  }
}

@injectable()
@staticImplements<IEventHandlerStatic>()
export class EmailReceivedEventHandler implements IEventHandler {
  async handle(event: EmailReceivedEvent) {
    return;
  }
  public static get type() {
    return EmailReceivedEvent.type;
  }
}
