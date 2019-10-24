import { Either } from "fp-ts/lib/Either";
import {
  UUID,
  Type,
  TimeStamp,
  Event,
  Errors,
  Results,
} from "@huckleberryai/core";

// Hash Function takes agentID, Event

export type Record = {
  timestamp: TimeStamp.T;
  agentID: UUID.T;
  eventID: UUID.T;
};

export interface RecordRepository {
  save(hash: string, record: Record): Promise<Either<Errors.Adapter.T, null>>;
  exists(hash: string): Promise<Either<Errors.Adapter.T, boolean>>;
}

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

export interface IAMService {
  // Check if token is valid and if it is sign the Event. If token is invalid, driver-adapter should clear session
  isAuthenticated(
    event: Event.T,
    token: string
  ): Promise<Either<Results.UnAuthenticated.T, Results.OK.T>>;

  // Used by driver-adapters to generate a token
  authenticate(agent: UUID.T): string;

  // Compute hash and store in repo
  sign(
    event: Event.T,
    agent: UUID.T
  ): Promise<Either<Results.Error.T, Results.OK.T>>;

  // Compute hash and return true if has exists in repo
  verify(
    event: Event.T,
    agent: UUID.T
  ): Promise<Either<Results.Error.T | Results.UnAuthenticated.T, Results.OK.T>>;

  // Verify event first, if it is verified then retrieve policies and check authorization
  isAuthorized(
    event: Event.T,
    agent: UUID.T,
    entity: UUID.T
  ): Promise<Either<Results.Error.T | Results.UnAuthorized.T, Results.OK.T>>;

  // Persist an Access Control Policy
  grantAuthorization(
    event: Event.T,
    agent: UUID.T,
    entity: UUID.T
  ): Promise<Either<Results.Error.T, Results.OK.T>>;

  // revokeAuthorization
}
