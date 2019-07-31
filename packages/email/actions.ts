import { EmailJSON } from "@sendgrid/helpers/classes/email-address";
import { AttachmentData } from "@sendgrid/helpers/classes/attachment";
import uuid from "uuid/v4";
import { Action } from "../base";

const EmailSendActionType = Symbol("EmailSendAction");
export class EmailSendAction extends Action {
  emailID: string;
  to: EmailJSON | EmailJSON[];
  cc: EmailJSON | EmailJSON[] | undefined;
  bcc: EmailJSON | EmailJSON[] | undefined;
  from: EmailJSON;
  replyTo: EmailJSON | undefined;
  inReplyTo: string | undefined;
  subject: string;
  text: string;
  html: string;
  attachments: AttachmentData[] | undefined;
  constructor(
    nodeID: string,
    agentID: string,
    corrID: string,
    parentID: string,
    config: {
      to: EmailJSON | EmailJSON[];
      cc?: EmailJSON | EmailJSON[];
      bcc?: EmailJSON | EmailJSON[];
      from: EmailJSON;
      replyTo?: EmailJSON;
      inReplyTo?: string;
      subject: string;
      text: string;
      html: string;
      attachments?: AttachmentData[];
    }
  ) {
    super(nodeID, agentID, corrID, parentID);
    this.emailID = uuid();
    this.to = config.to;
    this.cc = config.cc;
    this.bcc = config.bcc;
    this.replyTo = config.replyTo;
    this.inReplyTo = config.inReplyTo;
    this.from = config.from;
    this.subject = config.subject;
    this.text = config.text;
    this.html = config.html;
    this.attachments = config.attachments;
  }
  public get type(): symbol {
    return EmailSendActionType;
  }
  public static get type(): symbol {
    return EmailSendActionType;
  }
}
