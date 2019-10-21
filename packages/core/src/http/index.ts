import axios from "axios";
import { isSome } from "fp-ts/lib/Option";
import { left, Either, isLeft, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import * as Json from "../json";
import * as Event from "../event";
import * as Errors from "../errors";
import * as Results from "../results";
import { Url, Type } from "../values";

export const GetAPIURL = () =>
  process.env.API_URL ? process.env.API_URL : "http://localhost:8000";

export const GetEndpoint = (input: string) => {
  const api = GetAPIURL();
  const url = new URL(api);
  url.pathname = input;
  return url.toString() as Url.T;
};

export const EndpointFromEvent = (event: Event.T) =>
  AddEventParamsToURL(GetEndpoint(PathNameFromEvent(event)), event);

export const PathNameFromEvent = (event: Event.T) =>
  "/" + event.type.replace(/:/g, "/");

export const TypeFromPathName = (input: string) =>
  Type.Codec.decode(input.slice(1).replace(/\//g, ":"));

export const AddEventParamsToURL = (url: Url.T, event: Event.T) => {
  const urlCopy = new URL(url);
  urlCopy.searchParams.append("corr_id", event.corr);
  if (isSome(event.parent))
    urlCopy.searchParams.append("parent_id", event.parent.value);
  return urlCopy.toString() as Url.T;
};

export async function Post(
  url: Url.T,
  dto: Json.T
): Promise<Either<Errors.T, null>>;
export async function Post<T>(
  url: Url.T,
  dto: Json.T,
  codec: iots.Type<T, unknown, any>
): Promise<Either<Errors.T, T>>;
export async function Post<T>(
  url: Url.T,
  dto: Json.T,
  codec?: iots.Type<T, unknown, any>
) {
  try {
    const res = await axios.post(url, dto, {
      validateStatus: () => true,
    });
    if (!res.data.type) return left(Errors.Adapter.C());
    const responseType: Results.Names = res.data.type;
    const returnValue = Results.ReturnValues.get(responseType);
    if (returnValue) return returnValue;
    if (!codec) return left(Errors.Adapter.C());
    const result = Results.OKWithData.Codec(codec).decode(res.data);
    if (isLeft(result)) return left(Errors.Adapter.C());
    return right(result.right.data);
  } catch (error) {
    return left(Errors.Adapter.C());
  }
}

export const Beacon = (url: Url.T, dto: Json.T) =>
  navigator.sendBeacon(url, JSON.stringify(dto));
