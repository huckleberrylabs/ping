import { Either } from "fp-ts/lib/Either";
import { Phone, NonEmptyString } from "../values";

export type ISMSClient = (
  body: NonEmptyString.T,
  to: Phone.T
) => Promise<Either<Error, true>>;
