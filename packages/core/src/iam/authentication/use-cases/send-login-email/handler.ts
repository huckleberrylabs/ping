import { isLeft, Either } from "fp-ts/lib/Either";
import {
  IAccountRepository,
  IEmailClient,
  IAuthenticationService,
} from "../../../../interfaces";
import { ONE_TIME_ACCESS_TOKEN_EXPIRY } from "../../model";
import * as Command from "./command";
import {
  getEmailIntro,
  LoginLink,
  LoginEmailTemplate,
} from "../../../../email";
import { Errors } from "../../../../values";

export type IHandler = (
  command: Command.T
) => Either<Errors.Adapter.T | Errors.NotFound.T, null>;

export default (
  repo: IAccountRepository,
  emailClient: IEmailClient,
  authentication: IAuthenticationService
) => async (command: Command.T) => {
  // Get account
  const acccountMaybe = await repo.getByEmail(command.email);
  if (isLeft(acccountMaybe)) return acccountMaybe;
  const account = acccountMaybe.right;

  // Send login email
  const emailedMaybe = await emailClient(
    [
      {
        to: {
          address: account.email.email,
          name: account.name,
        },
        dynamicTemplateData: {
          greeting: getEmailIntro(),
          loginLink: LoginLink(
            authentication.generateToken(
              account.id,
              true,
              ONE_TIME_ACCESS_TOKEN_EXPIRY
            )
          ),
        },
      },
    ],
    LoginEmailTemplate
  );

  return emailedMaybe;
};
