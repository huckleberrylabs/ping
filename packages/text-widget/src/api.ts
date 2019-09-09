import axios from "axios";
import {
  Serializer,
  IEvent,
  IResult,
  Result,
  ENV,
  IsResult,
  IStatusCode,
  ResultDeserializer,
  ISerializedData,
} from "@huckleberryai/core";
import { API_ENDPOINT, EVENTS_ENDPOINT } from "@huckleberryai/text";

export async function postEvent(
  event: IEvent
): Promise<IResult<ISerializedData>> {
  if (ENV === "development") {
    // TODO: handle Development Mode
    throw new Error("Not Implemented Yet");
  } else {
    const res = await axios.post(
      API_ENDPOINT + EVENTS_ENDPOINT,
      Serializer(event, event.type)
    );
    if (!IsResult(res.data)) {
      return Result(
        res.data,
        <IStatusCode>res.status,
        event.origin,
        event.corr,
        event.id
      );
    }
    return ResultDeserializer(res.data);
  }
}

export async function beaconEvent(event: IEvent): Promise<void> {
  if (ENV === "production") {
    navigator.sendBeacon(
      API_ENDPOINT + EVENTS_ENDPOINT,
      JSON.parse(JSON.stringify(event))
    );
  }
}
