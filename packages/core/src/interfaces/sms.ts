import { Either } from "fp-ts/lib/Either";
import { Errors, NonEmptyString, Phone } from "../values";

export type ISMSService = (
  body: NonEmptyString.T,
  to: Phone.T
) => Promise<Either<Errors.Adapter.T, null>>;
