import { isLeft, Either } from "fp-ts/lib/Either";
import {
  IAccountRepository,
  IAuthenticationService,
  IEmailService,
} from "../../../../interfaces";
import { ONE_TIME_ACCESS_TOKEN_EXPIRY } from "../../model";
import * as Command from "./command";
import {
  GetEmailIntro,
  LoginLink,
  LoginEmailTemplate,
} from "../../../../email/model";
import { Errors } from "../../../../values";

export type IHandler = (
  command: Command.T
) => Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;

export default (
  repo: IAccountRepository,
  email: IEmailService,
  authentication: IAuthenticationService
): IHandler => async command => {
  // Get account
  const acccountMaybe = await repo.getByEmail(command.email);
  if (isLeft(acccountMaybe)) return acccountMaybe;
  const account = acccountMaybe.right;

  // Send login email
  const emailedMaybe = await email(
    [
      {
        to: {
          address: account.email.address,
          name: account.name,
        },
        dynamicTemplateData: {
          greeting: GetEmailIntro(),
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
