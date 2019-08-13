import axios from "axios";
import {
  IEvent,
  IResult,
  Result,
  Query,
  ID,
  ENV,
  isResult,
  StatusCode,
  OK,
} from "@huckleberryai/core";
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
        OK,
        TextWidgetSettingsQuery.type,
        new ID(),
        new ID(),
        new ID()
      );
    } else {
      return new Result(
        undefined,
        OK,
        event.type,
        event.originID,
        event.corrID,
        event.id
      );
    }
  } else {
    const res = await axios.post(
      API_ENDPOINT + EVENTS_ENDPOINT,
      JSON.parse(JSON.stringify(event))
    );
    try {
      if (isResult(res.data)) {
        return Result.fromJSON(res.data);
      } else {
        throw new Error("Not a Result");
      }
    } catch (error) {
      return new Result(
        res.data,
        <StatusCode>res.status,
        event.type,
        event.originID,
        event.corrID,
        event.id
      );
    }
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
