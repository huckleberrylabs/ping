import { Either } from "fp-ts/lib/Either";
import {
  NonEmptyString,
  EmailAddress,
  UUID,
  NameSpaceCaseString,
} from "../values";
import { Errors } from "../values";
import * as Account from "../iam/account";
import * as Authentication from "../iam/authentication";
import { IRepository } from "./repository";

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
  check(params: {
    account: UUID.T;
    entity?: UUID.T;
    action?: NameSpaceCaseString.T; // command or query
  }): Promise<Either<Errors.Adapter.T | Errors.Unauthorized.T, null>>;

  // create a new Access Control Policy
  grant(params: {
    account: UUID.T;
    entity?: UUID.T;
    action?: NameSpaceCaseString.T; // command or query
  }): Promise<Either<Errors.Adapter.T, null>>;

  // revoke an Access Control Policy
  revoke(params: {
    account: UUID.T;
    entity?: UUID.T;
    action?: NameSpaceCaseString.T; // command or query
  }): Promise<Either<Errors.Adapter.T, null>>;
}

export interface IInvalidTokenRepository {
  add(token: string): Promise<Either<Errors.Adapter.T, null>>;
  exists(
    token: string
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
}

export interface IAccessPolicyRepository {
  add(params: {
    account: UUID.T;
    entity?: UUID.T;
    action?: NameSpaceCaseString.T; // command or query
  }): Promise<Either<Errors.Adapter.T, null>>;
  remove(params: {
    account: UUID.T;
    entity?: UUID.T;
    action?: NameSpaceCaseString.T; // command or query
  }): Promise<Either<Errors.Adapter.T, null>>;
  exists(params: {
    account: UUID.T;
    entity?: UUID.T;
    action?: NameSpaceCaseString.T; // command or query
  }): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
}

export interface IAccountRepository extends IRepository<Account.Model.T> {
  getByEmail(
    email: EmailAddress.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Account.Model.T>>;
}
