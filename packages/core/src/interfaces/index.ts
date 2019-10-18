import { Either } from "fp-ts/lib/Either";
import { Phone, NonEmptyString } from "../values";
import * as Errors from "../errors";

export type SMSClient = (
  body: NonEmptyString.T,
  to: Phone.T
) => Promise<Either<Errors.Adapter.T, null>>;
