import { Either, right, left, map, flatten } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { fold } from "fp-ts/lib/Option";
import axios from "axios";
import { JSON, Url, INTERNAL_SERVER_ERROR } from "../../values";
import { Event } from "../event";
import { HTTPError } from "../../errors";
import { GetEndpoint } from "../../singletons";

export const Post = async (
  url: Url,
  dto: JSON
): Promise<Either<HTTPError, JSON>> => {
  try {
    const res = await axios.post(url, dto, {
      validateStatus: status => status < INTERNAL_SERVER_ERROR,
    });
    return right(res.data);
  } catch (error) {
    return left(new HTTPError());
  }
};

export const Beacon = (url: Url, dto: JSON) =>
  navigator.sendBeacon(url, JSON.stringify(dto));

export const EndpointFromEvent = (event: Event) =>
  pipe(
    GetEndpoint(event.type.replace(/:/g, "-")),
    map(url => AddEventParamsToURL(url, event)),
    flatten
  );

export const AddEventParamsToURL = (url: Url, event: Event) => {
  const urlCopy = new URL(url);
  urlCopy.searchParams.append("corr_id", event.corr);
  pipe(
    event.parent,
    fold(() => {}, parent => urlCopy.searchParams.append("parent_id", parent))
  );
  return Url(urlCopy.toString());
};
