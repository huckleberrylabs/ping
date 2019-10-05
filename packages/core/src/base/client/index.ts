import { Either, left, right } from "fp-ts/lib/Either";
import axios, { AxiosError } from "axios";
import { JSON } from "../../values";
import { IEvent } from "../event";
import { IResult, IsResult } from "../result";

export class ServerError extends Error {}
export class ClientError extends Error {}
export class NetworkError extends Error {}
export type APIError = ServerError | NetworkError | ClientError;

export type IPostEvent = (
  event: IEvent
) => Promise<Either<APIError, IResult<JSON>>>;

export type IPostEventFactory = (endpoint: string) => IPostEvent;

export type IBeaconEvent = (event: IEvent) => void;

export type IBeaconEventFactory = (endpoint: string) => IBeaconEvent;

export const PostEventFactory: IPostEventFactory = endpoint => async event => {
  try {
    const response = await axios.post(
      `${endpoint}?corr_id=${event.corr}&parent_id=${event.parent}&${event.agent}`,
      event,
      {
        validateStatus: () => true,
      }
    );
    if (IsResult(response.data)) return right(response.data);
    return left(new ServerError());
  } catch (error) {
    if (!(error as AxiosError).response)
      return left(new NetworkError(error.message));
    return left(new ClientError("validateStatus should have prevented"));
  }
};

export const BeaconEventFactory: IBeaconEventFactory = endpoint => event =>
  navigator.sendBeacon(endpoint, JSON.stringify(event));
