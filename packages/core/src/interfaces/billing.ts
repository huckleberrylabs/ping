import { Either } from "fp-ts/lib/Either";
import { NonEmptyString, EmailAddress, UUID, Errors } from "../values";
import { PromoCode } from "../billing/values";

export interface IBillingService {
  createAccount: (params: {
    idemKey: UUID.T;
    email: EmailAddress.T;
    paymentMethod?: NonEmptyString.T;
    promoCode?: PromoCode.T;
  }) => Promise<Either<Errors.Adapter.T, NonEmptyString.T>>;
  closeAccount: (params: {
    idemKey: UUID.T;
    customer: NonEmptyString.T;
  }) => Promise<Either<Errors.Adapter.T, null>>;
}
