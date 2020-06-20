import { Either } from "fp-ts/lib/Either";
import {
  NonEmptyString,
  PersonName,
  EmailAddress,
  UUID,
  Errors,
  PromoCode,
} from "../values";
import { Account } from "../iam";
import * as Widget from "../widget";

export interface IPrivateSDK {
  Account: {
    Get: (account: UUID.T) => Promise<Either<Errors.T, Account.Model.T>>;
    Register: (
      stripeToken: NonEmptyString.T,
      email: EmailAddress.T,
      userName: PersonName.T,
      billingEmail?: EmailAddress.T,
      name?: NonEmptyString.T,
      promoCode?: PromoCode.T
    ) => Promise<Either<Errors.T, UUID.T>>;
    Update: (
      account: UUID.T,
      email: EmailAddress.T,
      userName: PersonName.T,
      billingEmail?: EmailAddress.T,
      name?: NonEmptyString.T
    ) => Promise<Either<Errors.T, null>>;
    SendLoginEmail: (email: EmailAddress.T) => Promise<Either<Errors.T, null>>;
    LoginWithToken(token: NonEmptyString.T): Promise<Either<Errors.T, UUID.T>>;
    Logout(id: UUID.T): Promise<Either<Errors.T, null>>;
  };
  Widget: {
    Add: (
      account: UUID.T,
      widget: Widget.Model.T
    ) => Promise<Either<Errors.T, UUID.T>>;
    Update: (
      account: UUID.T,
      widget: Widget.Model.T
    ) => Promise<Either<Errors.T, null>>;
  };
}
