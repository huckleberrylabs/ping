import {
  NonEmptyString,
  PersonName,
  EmailAddress,
  TimeStamp,
} from "../../values";
import { SupportEmail, PingAdminURL } from "../../config";

export const LoginEmailTemplate: EmailTemplate = {
  id: "d-c0cd835132d1486d986d4c28f93219ba" as NonEmptyString.T,
  from: {
    address: SupportEmail,
    name: PersonName.C("Ping" as NonEmptyString.T),
  },
  replyTo: {
    address: SupportEmail,
    name: PersonName.C("Ping" as NonEmptyString.T),
  },
  unsubscribe: {
    groupId: 12562,
    groupsToDisplay: [12562, 12563],
  },
  categories: ["transactional" as NonEmptyString.T],
};

export const GetDayName = (date: Date): string => {
  const LOCALE = "en-US";
  return date.toLocaleDateString(LOCALE, { weekday: "long" });
};

export const GetEmailIntro = () => {
  const INTROS = [
    "Howdy partner :)",
    "Hi friend :)",
    "Ahoy, matey :)",
    "Ello, gov'nor :)",
    "Aloha :)",
    "Buongiorno :)",
    "Ciao :)",
    "Salut :)",
    "Guten tag :)",
    "Hola :)",
    "Konichiwa :)",
    `Happy ${GetDayName(new Date())}!`,
  ];
  return INTROS[Math.floor(Math.random() * INTROS.length)];
};

export const LoginLink = (token: string) => `${PingAdminURL}/?token=${token}`;

export type EmailAccount = {
  address: EmailAddress.T;
  name?: PersonName.T;
};

export type Email = {
  to: EmailAccount;
  cc?: EmailAccount;
  bcc?: EmailAccount;
  sendAt?: TimeStamp.T;
  dynamicTemplateData?: { [key: string]: any };
};

export type EmailAccountWithName = {
  address: EmailAddress.T;
  name: PersonName.T;
};

export type EmailTemplate = {
  id: NonEmptyString.T;
  from: EmailAccountWithName;
  replyTo: EmailAccountWithName;
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
