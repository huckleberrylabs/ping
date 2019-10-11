import { Either, right, left, map, flatten } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { fold } from "fp-ts/lib/Option";
import axios from "axios";
import { Json, Url, StatusCode } from "../values";
import * as Event from "../event";
import * as Errors from "../errors";
import { GetEndpoint } from "../singletons";

export const Post = async (
  url: Url.T,
  dto: Json.T
): Promise<Either<Errors.Adapter, Json.T>> => {
  try {
    const res = await axios.post(url, dto, {
      validateStatus: status => status < StatusCode.INTERNAL_SERVER_ERROR,
    });
    return right(res.data);
  } catch (error) {
    return left(new Errors.Adapter());
  }
};

export const Beacon = (url: Url.T, dto: Json.T) =>
  navigator.sendBeacon(url, JSON.stringify(dto));

export const EndpointFromEvent = (event: Event.T) =>
  pipe(
    GetEndpoint(event.type.replace(/:/g, "-")),
    map(url => AddEventParamsToURL(url, event)),
    flatten
  );

export const AddEventParamsToURL = (url: Url.T, event: Event.T) => {
  const urlCopy = new URL(url);
  urlCopy.searchParams.append("corr_id", event.corr);
  pipe(
    event.parent,
    fold(() => {}, parent => urlCopy.searchParams.append("parent_id", parent))
  );
  return Url.C(urlCopy.toString());
};
