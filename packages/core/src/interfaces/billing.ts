import { Either } from "fp-ts/lib/Either";
import {
  NonEmptyString,
  PersonName,
  EmailAddress,
  UUID,
  PromoCode,
  Errors,
} from "../values";

export interface IBillingService {
  createAccount: (params: {
    idemKey: UUID.T;
    email: EmailAddress.T;
    accountName?: NonEmptyString.T;
    userName: PersonName.T;
    paymentMethod: NonEmptyString.T;
    promoCode?: PromoCode.T;
    plan: NonEmptyString.T;
  }) => Promise<Either<Errors.Adapter.T, NonEmptyString.T>>;
}
