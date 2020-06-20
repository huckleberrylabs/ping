import { Either } from "fp-ts/lib/Either";
import {
  NonEmptyString,
  EmailAddress,
  UUID,
  NameSpaceCaseString,
} from "../values";
import { Errors } from "../values";
import * as Account from "../iam/account";
import * as Authorization from "../iam/authorization";
import * as Authentication from "../iam/authentication";

export interface IAuthenticationService {
  // generate access token
  generateToken(
    account: UUID.T,
    oneTime: boolean,
    expiry: string
  ): NonEmptyString.T;

  // verify and decode access token
  authenticateToken(
    token: NonEmptyString.T
  ): Promise<
    Either<Errors.Adapter.T | Errors.Unauthenticated.T, Authentication.Model.T>
  >;

  // invalidate access token
  invalidateToken(
    token: NonEmptyString.T
  ): Promise<Either<Errors.Adapter.T | Errors.Validation.T, null>>;
}

export interface IAuthorizationService {
  // check if account has authorization to perform the command or query and persist a Record
  check(
    account: UUID.T,
    entity: UUID.T,
    action: NameSpaceCaseString.T // command or query
  ): Promise<Either<Errors.Adapter.T | Errors.Unauthorized.T, null>>;

  // create a new Access Control Policy
  grant(
    account: UUID.T,
    entity: UUID.T,
    action: NameSpaceCaseString.T // command or query
  ): Promise<Either<Errors.Adapter.T, null>>;

  // revoke an Access Control Policy
  revoke(
    account: UUID.T,
    entity: UUID.T,
    action: NameSpaceCaseString.T // command or query
  ): Promise<Either<Errors.Adapter.T, null>>;
}

export interface IInvalidTokenRepository {
  add(token: string): Promise<Either<Errors.Adapter.T, null>>;
  exists(
    token: string
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
}

export interface IAccessPolicyRepository {
  add(record: Authorization.Model.T): Promise<Either<Errors.Adapter.T, null>>;
  remove(hash: string): Promise<Either<Errors.Adapter.T, null>>;
  exists(
    hash: string
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
}

export interface IAccountRepository {
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Account.Model.T>>;
  getByEmail(
    email: EmailAddress.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Account.Model.T>>;
  add(account: Account.Model.T): Promise<Either<Errors.Adapter.T, null>>;
  update(
    account: Account.Model.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
  exists(
    id: UUID.T
  ): Promise<
    Either<Errors.Adapter.T | Errors.NotImplemented.T | Errors.NotFound.T, null>
  >;
}
