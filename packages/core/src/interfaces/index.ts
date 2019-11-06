import { Either } from "fp-ts/lib/Either";
import {
  Phone,
  NonEmptyString,
  PersonName,
  EmailAddress,
  TimeStamp,
} from "../values";
import * as Errors from "../errors";

export type SMSClient = (
  body: NonEmptyString.T,
  to: Phone.T
) => Promise<Either<Errors.Adapter.T, null>>;

export type EmailAccount = {
  address: EmailAddress.T;
  name: PersonName.T;
};

export type Email = {
  to: EmailAccount;
  cc?: EmailAccount;
  bcc?: EmailAccount;
  sendAt?: TimeStamp.T;
  dynamicTemplateData?: { [key: string]: any };
};

export type EmailTemplate = {
  id: NonEmptyString.T;
  from: EmailAccount;
  replyTo: EmailAccount;
  unsubscribe: {
    groupId: number;
    groupsToDisplay: number[];
  };
  categories: NonEmptyString.T[];
};

export type EmailOptions = {
  mailSettings?: {
    bypassListManagement?: {
      enable?: boolean;
    };
    sandboxMode?: {
      enable?: boolean;
    };
  };
  ipPoolName?: string;
};

export type EmailClient = (
  emails: Email[],
  template: EmailTemplate,
  options?: EmailOptions
) => Promise<Either<Errors.Adapter.T, null>>;
