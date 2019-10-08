import { Either, right, left, map } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { fold } from "fp-ts/lib/Option";
import axios from "axios";
import { JSON, Url, INTERNAL_SERVER_ERROR } from "../../values";
import { Event } from "../event";
import { HTTPError } from "../../errors";
import { GetEndpoint } from "../../singletons";

export type IPost = (url: Url, dto: JSON) => Promise<Either<HTTPError, JSON>>; // TODO replace with TaskEither

export const Post: IPost = async (url: Url, dto: JSON) => {
  try {
    return right(
      (await axios.post(url, dto, {
        validateStatus: status => status < INTERNAL_SERVER_ERROR,
      })).data
    );
  } catch (error) {
    return left(new HTTPError());
  }
};

export const Beacon = (url: Url, dto: JSON) =>
  navigator.sendBeacon(url, JSON.stringify(dto));

export const EndpointFromEvent = (event: Event) =>
  pipe(
    GetEndpoint(event.type),
    map(url => AddEventParamsToURL(url, event))
  );

export const AddEventParamsToURL = (url: Url, event: Event) => {
  const urlCopy = new URL(url);
  urlCopy.searchParams.append("corr_id", event.corr);
  pipe(
    event.parent,
    fold(() => {}, parent => urlCopy.searchParams.append("parent_id", parent))
  );
  pipe(
    event.agent,
    fold(() => {}, agent => urlCopy.searchParams.append("agent_id", agent))
  );
  return Url(urlCopy.toString());
};
