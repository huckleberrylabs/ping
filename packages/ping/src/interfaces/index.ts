import { Either } from "fp-ts/lib/Either";
import {
  Errors,
  UUID,
  NonEmptyString,
  PersonName,
  EmailAddress,
  Phone,
} from "@huckleberryai/core";
import * as Account from "../account";
import * as Widget from "../widget";
import * as Message from "../message";
/* 
export type Record = {
  hash: NonEmptyString.T;
  timestamp: TimeStamp.T;
  agentID: UUID.T;
  eventID: UUID.T;
}; */
/* 
export interface RecordRepository {
  save(record: Record): Promise<Either<Errors.Adapter.T, null>>;
  exists(hash: NonEmptyString.T): Promise<Either<Errors.Adapter.T, boolean>>;
} */
/* 
export type Policy = {
  agent: UUID.T;
  name: Type.T;
  entity: UUID.T;
};

export interface PolicyRepository {
  getByAgent(
    agent: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Policy>>;
}
 */
export interface IAMService {
  generateOneTimeToken(agent: UUID.T): NonEmptyString.T;
  generateToken(agent: UUID.T): NonEmptyString.T;
  authenticateToken(
    token: NonEmptyString.T
  ): Either<Errors.Parsing.T | Errors.Unauthenticated.T, null>;
  getAgentFromToken(string: NonEmptyString.T): Either<Errors.Parsing.T, UUID.T>;
  // revokeToken
  /*   
  // compute hash and store in repo
  authenticateEvent(
    token: string,
    event: Event.T
  ): Promise<Either<Errors.Adapter.T, null>>;
    
  // verifyEvent (hash and check if exists in repo), retrieve policies and check authorization
  isAuthorized(
    event: Event.T,
    agent: UUID.T,
    entity: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.Unauthorized.T, null>>;

  // Persist an Access Control Policy
  grantAuthorization(
    event: Event.T,
    agent: UUID.T,
    entity: UUID.T
  ): Promise<Either<Errors.Adapter.T, null>>;

  // revokeAuthorization
  */
}

export interface BillingService {
  createAccount: (input: {
    idemKey: UUID.T;
    email: EmailAddress.T;
    accountName?: NonEmptyString.T;
    userName: PersonName.T;
    paymentMethod: NonEmptyString.T;
  }) => Promise<Either<Errors.Adapter.T, NonEmptyString.T>>;
  addSeat: (
    idemKey: UUID.T,
    stripeCustomer: NonEmptyString.T,
    plan: NonEmptyString.T
  ) => Promise<Either<Errors.Adapter.T, null>>;
  removeSeat: (
    idemKey: UUID.T,
    stripeCustomer: NonEmptyString.T,
    plan: NonEmptyString.T
  ) => Promise<Either<Errors.Adapter.T, null>>;
}

export interface AccountRepository {
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Account.T>>;
  getByEmail(
    email: EmailAddress.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Account.T[]>>;
  add(account: Account.T): Promise<Either<Errors.Adapter.T, null>>;
  update(
    account: Account.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
}

export interface WidgetRepository {
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Widget.T>>;
  add(widget: Widget.T): Promise<Either<Errors.Adapter.T, null>>;
  remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
  update(
    widget: Widget.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;
}

export interface MessageRepository {
  get(
    id: UUID.T
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Message.T>>;
  add(event: Message.Events): Promise<Either<Errors.Adapter.T, null>>;
  remove(id: UUID.T): Promise<Either<Errors.Adapter.T, null>>;
}

export interface PublicSDK {
  Message: {
    Create: () => Promise<UUID.T>;
    AddText: (
      message: UUID.T,
      text: NonEmptyString.T
    ) => Promise<Either<Errors.T, null>>;
    AddPhone: (
      message: UUID.T,
      phone: Phone.T
    ) => Promise<Either<Errors.T, null>>;
    AddName: (
      message: UUID.T,
      name: PersonName.T
    ) => Promise<Either<Errors.T, null>>;
    Send: (message: UUID.T) => Promise<Either<Errors.T, null>>;
  };
  Widget: {
    Get: () => Promise<Either<Errors.T, Widget.T>>;
  };
}

export interface PrivateSDK {
  Account: {
    Get: (
      account: UUID.T,
      corr?: UUID.T
    ) => Promise<Either<Errors.T, Account.T>>;
    Register: (
      stripeToken: NonEmptyString.T,
      email: EmailAddress.T,
      userName: PersonName.T,
      billingEmail?: EmailAddress.T,
      name?: NonEmptyString.T,
      corr?: UUID.T
    ) => Promise<Either<Errors.T, UUID.T>>;
    Update: (
      account: UUID.T,
      email: EmailAddress.T,
      userName: PersonName.T,
      billingEmail?: EmailAddress.T,
      name?: NonEmptyString.T,
      corr?: UUID.T
    ) => Promise<Either<Errors.T, null>>;
    SendLoginEmail: (
      email: EmailAddress.T,
      corr?: UUID.T
    ) => Promise<Either<Errors.T, null>>;
    LoginWithToken(
      token: NonEmptyString.T,
      corr?: UUID.T
    ): Promise<Either<Errors.T, UUID.T>>;
    Logout(id: UUID.T, corr?: UUID.T): Promise<Either<Errors.T, null>>;
  };
  Widget: {
    Add: (
      account: UUID.T,
      widget: Widget.T,
      corr?: UUID.T
    ) => Promise<Either<Errors.T, UUID.T>>;
    Update: (
      account: UUID.T,
      widget: Widget.T,
      corr?: UUID.T
    ) => Promise<Either<Errors.T, null>>;
  };
}
