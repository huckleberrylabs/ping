import moment from "moment";
import { Event } from "../base";
import { HTTPAccessEvent } from "../access";

// Custom Events

const EmailReceivedEventType = Symbol("EmailReceivedEvent");
export class EmailReceivedEvent extends Event {
  public get type(): symbol {
    return EmailReceivedEventType;
  }
  public static get type(): symbol {
    return EmailReceivedEventType;
  }
}

const EmailOpenedEventType = Symbol("EmailReceivedEvent");
export class EmailOpenedEvent extends HTTPAccessEvent {
  public get type(): symbol {
    return EmailOpenedEventType;
  }
  public static get type(): symbol {
    return EmailOpenedEventType;
  }
}

// SendGrid Based Events

type EmailSendGridEventType =
  | "processed"
  | "dropped"
  | "delivered"
  | "deferred"
  | "bounce"
  | "open"
  | "click"
  | "spam_report"
  | "unsubscribe"
  | "group_unsubscribe"
  | "group_resubscribe";

export type EmailSendGridEvent = {
  event: EmailSendGridEventType;
  timestamp: number;
  email: string;
  "smpt-id": number;
  sg_event_id: string;
  sg_message_id: string;
  category: string | string[] | undefined;

  pool: {
    name: string;
    id: number;
  };
  reason: string | undefined;
  status: string | undefined;
  response: string | undefined;
  attempt: number;

  // These are not used because the SendGrid Event types open, click, group_unsubscribe, group_resubscribe are not implemented.
  useragent: string | undefined;
  ip: string | undefined;
  url: string | undefined;
  url_offset: {
    index: number;
    type: string;
  };
  asm_group_id: number | undefined;

  // These are not used because the marketing campaign feature isn't being used
  marketing_campaign_id: number | undefined;
  marketing_campaign_name: string | undefined;
  marketing_campaign_version: string | undefined;

  // These are not used because I cant find anywhere in the api docs what events posess these properties.
  type: "blocked" | "bounce" | undefined;
  tls: boolean;

  // Unique Arguments passed to Sendgrid when sending an email will propagate to events returned by said email.
  [key: string]: any;
};

const EmailEventType = Symbol("EmailEvent");
export class EmailEvent extends Event {
  emailID: string;
  email: string;
  smptID: number;
  category: string[];
  sendGridEventID: string;
  sendGridMessageID: string;
  constructor(nodeID: string, sendGridEvent: EmailSendGridEvent) {
    super(nodeID, sendGridEvent.rotaruCorrID, sendGridEvent.rotaruParentID);
    this.timestamp = moment(sendGridEvent.timestamp).toISOString();
    this.emailID = sendGridEvent.rotaruEmailID;
    this.email = sendGridEvent.email;
    this.smptID = sendGridEvent["smpt-id"];
    if (typeof sendGridEvent.category === "string") {
      this.category = [sendGridEvent.category];
    } else if (typeof sendGridEvent.category === "undefined") {
      this.category = [];
    } else {
      this.category = sendGridEvent.category;
    }
    this.sendGridEventID = sendGridEvent.sg_event_id;
    this.sendGridMessageID = sendGridEvent.sg_message_id;
  }
  public get type(): symbol {
    return EmailEventType;
  }
  public static get type(): symbol {
    return EmailEventType;
  }
}

const EmailProcessedEventType = Symbol("EmailProcessedEvent");
export class EmailProcessedEvent extends EmailEvent {
  pool: {
    name: string;
    id: number;
  };
  constructor(nodeID: string, sendGridEvent: EmailSendGridEvent) {
    super(nodeID, sendGridEvent);
    this.pool = sendGridEvent.pool;
  }
  public get type(): symbol {
    return EmailProcessedEventType;
  }
  public static get type(): symbol {
    return EmailProcessedEventType;
  }
}

const EmailDroppedEventType = Symbol("EmailDroppedEvent");
export class EmailDroppedEvent extends EmailEvent {
  reason: string | undefined;
  status: string | undefined;
  constructor(nodeID: string, sendGridEvent: EmailSendGridEvent) {
    super(nodeID, sendGridEvent);
    this.reason = sendGridEvent.reason;
    this.status = sendGridEvent.status;
  }
  public get type(): symbol {
    return EmailDroppedEventType;
  }
  public static get type(): symbol {
    return EmailDroppedEventType;
  }
}

const EmailDeliveredEventType = Symbol("EmailDeliveredEvent");
export class EmailDeliveredEvent extends EmailEvent {
  response: string | undefined;
  constructor(nodeID: string, sendGridEvent: EmailSendGridEvent) {
    super(nodeID, sendGridEvent);
    this.response = sendGridEvent.response;
  }
  public get type(): symbol {
    return EmailDeliveredEventType;
  }
  public static get type(): symbol {
    return EmailDeliveredEventType;
  }
}

const EmailDeferredEventType = Symbol("EmailDeferredEvent");
export class EmailDeferredEvent extends EmailEvent {
  response: string | undefined;
  attempt: number;
  constructor(nodeID: string, sendGridEvent: EmailSendGridEvent) {
    super(nodeID, sendGridEvent);
    this.response = sendGridEvent.response;
    this.attempt = sendGridEvent.attempt;
  }
  public get type(): symbol {
    return EmailDeferredEventType;
  }
  public static get type(): symbol {
    return EmailDeferredEventType;
  }
}

const EmailBouncedEventType = Symbol("EmailBouncedEvent");
export class EmailBouncedEvent extends EmailEvent {
  reason: string | undefined;
  status: string | undefined;
  constructor(nodeID: string, sendGridEvent: EmailSendGridEvent) {
    super(nodeID, sendGridEvent);
    this.reason = sendGridEvent.reason;
    this.status = sendGridEvent.status;
  }
  public get type(): symbol {
    return EmailBouncedEventType;
  }
  public static get type(): symbol {
    return EmailBouncedEventType;
  }
}

const EmailUnsubscribedEventType = Symbol("EmailUnsubscribedEvent");
export class EmailUnsubscribedEvent extends EmailEvent {
  public get type(): symbol {
    return EmailUnsubscribedEventType;
  }
  public static get type(): symbol {
    return EmailUnsubscribedEventType;
  }
}

const EmailSpamEventType = Symbol("EmailSpamEvent");
export class EmailSpamEvent extends EmailEvent {
  public get type(): symbol {
    return EmailSpamEventType;
  }
  public static get type(): symbol {
    return EmailSpamEventType;
  }
}
