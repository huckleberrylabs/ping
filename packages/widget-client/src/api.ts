import axios, { AxiosResponse } from "axios";
import {
  IResult,
  Result,
  IEvent,
  JSON,
  StatusCode,
  INTERNAL_SERVER_ERROR,
  ENV,
  API_ENDPOINT,
  EVENTS_ENDPOINT,
} from "@huckleberryai/core";

/** will never throw an error */
export async function postEvent<ReturnType extends JSON>(
  event: IEvent
): Promise<IResult<ReturnType | string>> {
  if (ENV === "development") {
    // TODO: handle development mode
    throw new Error("not implemented yet");
  } else {
    // send the event
    let res: AxiosResponse<any>;
    try {
      res = await axios.post(API_ENDPOINT + EVENTS_ENDPOINT, event, {
        validateStatus: () => true,
      });
    } catch (error) {
      if (error.response) {
        // the request was made and the server responded with a status code that falls out of the range of validateStatus
        return Result(
          "this should never happen. validateStatus should return true.",
          INTERNAL_SERVER_ERROR,
          event.origin,
          event.corr,
          event.id
        );
      } else {
        // the request was made but no response was received or something happened in setting up the request that triggered an error
        return Result(
          error.toString(),
          INTERNAL_SERVER_ERROR,
          event.origin,
          event.corr,
          event.id
        );
      }
    }
    // deserialize the response
    try {
      return <IResult<ReturnType>>res.data;
    } catch (error) {
      // the response received cannot be deserialized by the client, probably because the correct deserializer is missing in the ioc container
      return Result(
        error.toString(),
        <StatusCode>res.status,
        event.origin,
        event.corr,
        event.id
      );
    }
  }
}

/** will throw an error if the event is not serializable during runtime */
export async function beaconEvent(event: IEvent): Promise<void> {
  if (ENV === "development") {
    // TODO: handle development mode
    throw new Error("not implemented yet");
  } else {
    navigator.sendBeacon(API_ENDPOINT + EVENTS_ENDPOINT, JSON.stringify(event));
  }
}
