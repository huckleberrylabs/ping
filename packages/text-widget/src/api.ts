import axios from "axios";
import { IEvent, IResult, Result, Query, ID, ENV } from "@huckleberryai/core";
import {
  API_ENDPOINT,
  EVENTS_ENDPOINT,
  TextWidgetSettings,
  TextWidgetSettingsQuery,
} from "@huckleberryai/text";

export async function postEvent(event: IEvent): Promise<IResult> {
  if (ENV === "development") {
    if (event instanceof Query) {
      return new Result(
        new TextWidgetSettings(""),
        new ID(),
        new ID(),
        new ID(),
        TextWidgetSettingsQuery.type
      );
    } else {
      return new Result(
        undefined,
        event.originID,
        event.corrID,
        event.id,
        event.type
      );
    }
  } else {
    const res = await axios.post(
      API_ENDPOINT + EVENTS_ENDPOINT,
      JSON.parse(JSON.stringify(event))
    );
    if (res.status >= 200 && res.status < 300) {
      if (res.data) {
        return Result.fromJSON(res.data);
      }
    }
    return new Result(
      undefined,
      event.originID,
      event.corrID,
      event.id,
      event.type
    );
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
