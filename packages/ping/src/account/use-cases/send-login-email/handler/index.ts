import { isLeft } from "fp-ts/lib/Either";
import {
  Results,
  EmailClient,
  EmailTemplate,
  NonEmptyString,
  PersonName,
  EmailAddress,
  Env,
  Errors,
} from "@huckleberryai/core";
import { AccountRepository, IAMService } from "../../../../interfaces";
import * as Command from "../command";
import * as Event from "../event";

const LoginEmailTemplate: EmailTemplate = {
  id: "d-c0cd835132d1486d986d4c28f93219ba" as NonEmptyString.T,
  from: {
    address: "no-reply@ping.buzz" as EmailAddress.T,
    name: PersonName.C("Ping" as NonEmptyString.T),
  },
  replyTo: {
    address: "no-reply@ping.buzz" as EmailAddress.T,
    name: PersonName.C("Ping" as NonEmptyString.T),
  },
  unsubscribe: {
    groupId: 12562,
    groupsToDisplay: [12562, 12563],
  },
  categories: ["transactional" as NonEmptyString.T],
};

const GenerateLoginLink = (token: string) =>
  `${
    Env.Get() === "development"
      ? "http://localhost:3000"
      : "https://admin.ping.buzz"
  }/login?token=${token}`;

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
        accountName: account.name,
        loginLink: GenerateLoginLink(iam.generateOneTimeToken(account.id)),
      },
    })),
    LoginEmailTemplate
  );
  if (isLeft(emailedMaybe)) return Results.Error.C(command);
  return Results.OK.C(command);
};
