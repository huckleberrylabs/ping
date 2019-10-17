import { right, left, map, flatten } from "fp-ts/lib/Either";
import { TaskEither } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { fold } from "fp-ts/lib/Option";
import axios from "axios";
import { Json, Url, StatusCode, Env, Type } from "../values";
import * as Event from "../event";
import * as Errors from "../errors";

export const GetAPIURL = () =>
  pipe(
    Env.Get(),
    map(env => {
      const APIURLS: {
        [P in Env.T]: Url.T;
      } = {
        development: "http://localhost:8000" as Url.T,
        staging: "https://staging.huckleberry.app" as Url.T,
        production: "https://api.huckleberry.app" as Url.T,
        test: "http://localhost:8000" as Url.T,
      };
      return APIURLS[env];
    })
  );

export const GetEndpoint = (input: string) =>
  pipe(
    GetAPIURL(),
    map(url => new URL(url)),
    map(url => {
      url.pathname = input;
      return url.toString();
    }),
    map(Url.C),
    flatten
  );

export const EndpointFromEvent = (event: Event.T) =>
  pipe(
    PathNameFromEvent(event),
    GetEndpoint,
    map(url => AddEventParamsToURL(url, event)),
    flatten
  );

export const PathNameFromEvent = (event: Event.T) =>
  "/" + event.type.replace(/:/g, "/");

export const EventTypeFromPathName = (input: string): Type.T =>
  input.slice(1).replace(/\//g, ":") as Type.T;

export const AddEventParamsToURL = (url: Url.T, event: Event.T) => {
  const urlCopy = new URL(url);
  urlCopy.searchParams.append("corr_id", event.corr);
  pipe(
    event.parent,
    fold(() => {}, parent => urlCopy.searchParams.append("parent_id", parent))
  );
  return Url.C(urlCopy.toString());
};

export const Post = (
  url: Url.T,
  dto: Json.T
): TaskEither<Errors.Adapter.T, Json.T> => async () => {
  try {
    const res = await axios.post(url, dto, {
      validateStatus: status => status < StatusCode.INTERNAL_SERVER_ERROR,
    });
    return right(res.data);
  } catch (error) {
    return left(Errors.Adapter.C());
  }
};

export const Beacon = (url: Url.T, dto: Json.T) =>
  navigator.sendBeacon(url, JSON.stringify(dto));
