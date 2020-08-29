import { Either } from "fp-ts/lib/Either";
import { Errors } from "../values";
import { Email, EmailTemplate, EmailOptions } from "../email/model";

export type IEmailService = (
  emails: Email[],
  template: EmailTemplate,
  options?: EmailOptions
) => Promise<Either<Errors.Adapter.T, null>>;
