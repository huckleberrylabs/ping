import { isLeft } from "fp-ts/lib/Either";
import {
  Results,
  EmailClient,
  EmailTemplate,
  NonEmptyString,
  PersonName,
  Errors,
} from "@huckleberryai/core";
import { AccountRepository, IAMService } from "../../../../interfaces";
import { SupportEmail, PingAdminURL } from "../../../../config";
import * as Command from "../command";
import * as Event from "../event";

const LoginEmailTemplate: EmailTemplate = {
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

export const getDayName = (date: Date): string => {
  const LOCALE = "en-US";
  return date.toLocaleDateString(LOCALE, { weekday: "long" });
};

const getEmailIntro = () => {
  const INTROS = [
    "Howdy partner!",
    "Hi friend!",
    "Ahoy, matey!",
    "Ello, gov'nor!",
    "Aloha!",
    "Buongiorno!",
    "Ciao!",
    "Salut!",
    "Guten tag!",
    "Hola! Mucho Gusto!",
    "Konichiwa!",
    `Happy ${getDayName(new Date())}!`,
  ];
  return INTROS[Math.floor(Math.random() * INTROS.length)];
};

const LoginLink = (token: string) => `${PingAdminURL}/login?token=${token}`;

export const Handler = (
  repo: AccountRepository,
  emailClient: EmailClient,
  iam: IAMService
) => async (command: Command.T) => {
  const event = Event.C(command);
  const acccountsMaybe = await repo.getByEmail(event.email);
  if (isLeft(acccountsMaybe)) {
    switch (acccountsMaybe.left.type) {
      case Errors.NotFound.Name:
        return Results.NotFound.C(command);
      default:
        return Results.Error.C(command);
    }
  }
  const accounts = acccountsMaybe.right;

  const emailedMaybe = await emailClient(
    accounts.map(account => ({
      to: {
        address: account.email,
        name: account.userName,
      },
      dynamicTemplateData: {
        greeting: getEmailIntro(),
        loginLink: LoginLink(iam.generateOneTimeToken(account.id)),
      },
    })),
    LoginEmailTemplate
  );
  if (isLeft(emailedMaybe)) return Results.Error.C(command);
  return Results.OK.C(command);
};
