import axios from "axios";
import {
  IResult,
  Result,
  IsResult,
  ResultDeserializer,
} from "@huckleberryai/core/src/entities/result";
import { IEvent } from "@huckleberryai/core/src/entities/event";
import { ISerializedData } from "@huckleberryai/core/src/value-objects/data";
import { IStatusCode } from "@huckleberryai/core/src/value-objects/status-code";
import { ENV } from "@huckleberryai/core/src/singletons/env";
import {
  API_ENDPOINT,
  EVENTS_ENDPOINT,
} from "@huckleberryai/text/src/singletons";
import { serializer } from "./structural";

export async function postEvent(
  event: IEvent
): Promise<IResult<ISerializedData>> {
  if (ENV === "development") {
    // TODO: handle Development Mode
    throw new Error("Not Implemented Yet");
  } else {
    const res = await axios.post(
      API_ENDPOINT + EVENTS_ENDPOINT,
      serializer(event, event.type)
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
